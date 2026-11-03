import { useSyncExternalStore } from "react";
import type { MotifSpec, MusicEvent } from "./types";
import { scheduleMotif } from "./synth";
import { motifDuration } from "./score";

/**
 * Zentrale Audio-Steuerung (ein einziger AudioContext für die ganze App).
 * Es läuft immer nur eine Quelle gleichzeitig. Audio startet ausschliesslich
 * nach einer Benutzeraktion (Klick/Taste), wie es Browser verlangen.
 */

export type SourceKind = "motif" | "file" | "buffer";

export interface PlaybackState {
  playing: boolean;
  /** frei wählbare ID, z. B. "motif:be" oder "word:be:0" */
  sourceId: string | null;
  kind: SourceKind | null;
  title: string;
  /** zugehöriger Kanton (für Kartenreaktionen) */
  cantonId: string | null;
  duration: number;
  startedAt: number;
  error: string | null;
  muted: boolean;
  /** Warteschlange (z. B. Vergleich «nacheinander abspielen») */
  queueLength: number;
}

type Listener = () => void;
type EventListener = (e: MusicEvent & { cantonId: string | null }) => void;

interface QueueItem {
  run: () => Promise<void>;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private analyser!: AnalyserNode;
  private currentBus: GainNode | null = null;
  private mediaEl: HTMLAudioElement | null = null;
  private mediaSrc: MediaElementAudioSourceNode | null = null;
  private bufferSrc: AudioBufferSourceNode | null = null;
  private pending: MusicEvent[] = [];
  private raf = 0;
  private endTimer = 0;
  private queue: QueueItem[] = [];
  private listeners = new Set<Listener>();
  private eventListeners = new Set<EventListener>();
  private token = 0;
  private inQueueRun = false;

  state: PlaybackState = {
    playing: false,
    sourceId: null,
    kind: null,
    title: "",
    cantonId: null,
    duration: 0,
    startedAt: 0,
    error: null,
    muted: false,
    queueLength: 0,
  };

  get supported(): boolean {
    return typeof window !== "undefined" && ("AudioContext" in window || "webkitAudioContext" in window);
  }

  /** Muss in einem Klick-Handler aufgerufen werden. */
  ensure(): AudioContext {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.state.muted ? 0 : 0.9;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value = 4;
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.78;
      this.master.connect(comp).connect(this.analyser).connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  get context(): AudioContext | null {
    return this.ctx;
  }

  getAnalyser(): AnalyserNode | null {
    return this.ctx ? this.analyser : null;
  }

  now(): number {
    return this.ctx?.currentTime ?? 0;
  }

  /** Fortschritt 0…1 der aktuellen Wiedergabe */
  progress(): number {
    const s = this.state;
    if (!s.playing || !s.duration) return 0;
    if (s.kind === "file" && this.mediaEl) return this.mediaEl.currentTime / (this.mediaEl.duration || s.duration);
    return Math.min(1, (this.now() - s.startedAt) / s.duration);
  }

  elapsed(): number {
    const s = this.state;
    if (!s.playing) return 0;
    if (s.kind === "file" && this.mediaEl) return this.mediaEl.currentTime;
    return Math.max(0, this.now() - s.startedAt);
  }

  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  onMusicEvent(fn: EventListener) {
    this.eventListeners.add(fn);
    return () => {
      this.eventListeners.delete(fn);
    };
  }

  getState = () => this.state;

  private set(patch: Partial<PlaybackState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  setMuted(muted: boolean) {
    if (this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.05);
    this.set({ muted });
  }

  /** Stoppt alles (inkl. Warteschlange). */
  stop() {
    this.queue = [];
    this.stopCurrent();
    this.set({ playing: false, sourceId: null, kind: null, cantonId: null, queueLength: 0 });
  }

  private stopCurrent() {
    this.token++;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.endTimer);
    this.pending = [];
    if (this.currentBus && this.ctx) {
      const bus = this.currentBus;
      bus.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
      setTimeout(() => bus.disconnect(), 400);
      this.currentBus = null;
    }
    if (this.mediaEl) {
      this.mediaEl.pause();
      this.mediaEl.src = "";
      this.mediaEl = null;
    }
    if (this.mediaSrc) {
      this.mediaSrc.disconnect();
      this.mediaSrc = null;
    }
    if (this.bufferSrc) {
      try {
        this.bufferSrc.stop();
      } catch {
        /* bereits gestoppt */
      }
      this.bufferSrc = null;
    }
  }

  private finish(token: number) {
    if (token !== this.token) return;
    this.stopCurrent();
    const next = this.queue.shift();
    if (next) {
      this.set({ queueLength: this.queue.length });
      this.inQueueRun = true;
      void next.run();
      this.inQueueRun = false;
    } else this.set({ playing: false, sourceId: null, kind: null, cantonId: null, queueLength: 0 });
  }

  private tick = () => {
    const t = this.now();
    while (this.pending.length && this.pending[0].time <= t + 0.01) {
      const e = this.pending.shift()!;
      this.eventListeners.forEach((l) => l({ ...e, cantonId: this.state.cantonId }));
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  async playMotif(sourceId: string, spec: MotifSpec, cantonId: string | null, title = spec.title) {
    if (!this.inQueueRun) {
      this.queue = [];
      this.set({ queueLength: 0 });
    }
    const ctx = this.ensure();
    this.stopCurrent();
    const token = this.token;
    const bus = ctx.createGain();
    bus.connect(this.master);
    this.currentBus = bus;
    const t0 = ctx.currentTime + 0.08;
    this.pending = scheduleMotif(ctx, bus, spec, t0);
    const duration = motifDuration(spec);
    this.set({ playing: true, sourceId, kind: "motif", title, cantonId, duration, startedAt: t0, error: null });
    this.raf = requestAnimationFrame(this.tick);
    this.endTimer = window.setTimeout(() => this.finish(token), (duration + 0.6) * 1000);
  }

  async playFile(sourceId: string, url: string, cantonId: string | null, title: string) {
    if (!this.inQueueRun) {
      this.queue = [];
      this.set({ queueLength: 0 });
    }
    const ctx = this.ensure();
    this.stopCurrent();
    const token = this.token;
    const el = new Audio();
    el.crossOrigin = "anonymous";
    el.preload = "auto";
    el.src = url;
    this.mediaEl = el;
    const bus = ctx.createGain();
    bus.connect(this.master);
    this.currentBus = bus;
    this.mediaSrc = ctx.createMediaElementSource(el);
    this.mediaSrc.connect(bus);
    this.set({ playing: true, sourceId, kind: "file", title, cantonId, duration: 0, startedAt: ctx.currentTime, error: null });
    el.addEventListener("loadedmetadata", () => {
      if (token === this.token) this.set({ duration: el.duration || 0 });
    });
    el.addEventListener("ended", () => this.finish(token));
    el.addEventListener("error", () => {
      if (token !== this.token) return;
      this.stopCurrent();
      this.set({
        playing: false,
        sourceId: null,
        kind: null,
        cantonId: null,
        error: `Die Audiodatei «${url}» konnte nicht geladen werden. Prüfe, ob die Datei im Ordner public/ liegt und der Pfad stimmt.`,
      });
    });
    try {
      await el.play();
    } catch (err) {
      if (token === this.token && (err as Error).name !== "AbortError") {
        this.set({ error: "Wiedergabe nicht möglich: " + (err as Error).message });
      }
    }
  }

  playBuffer(sourceId: string, buffer: AudioBuffer, cantonId: string | null, title: string) {
    if (!this.inQueueRun) {
      this.queue = [];
      this.set({ queueLength: 0 });
    }
    const ctx = this.ensure();
    this.stopCurrent();
    const token = this.token;
    const bus = ctx.createGain();
    bus.connect(this.master);
    this.currentBus = bus;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(bus);
    const t0 = ctx.currentTime + 0.03;
    src.start(t0);
    src.onended = () => this.finish(token);
    this.bufferSrc = src;
    this.set({ playing: true, sourceId, kind: "buffer", title, cantonId, duration: buffer.duration, startedAt: t0, error: null });
  }

  /** Spielt mehrere Quellen nacheinander (z. B. Bern → Zürich). */
  playSequence(items: (() => Promise<void> | void)[]) {
    this.ensure();
    this.stop();
    const [first, ...rest] = items;
    this.queue = rest.map((fn) => ({ run: async () => void (await fn()) }));
    this.set({ queueLength: this.queue.length });
    this.inQueueRun = true;
    void first?.();
    this.inQueueRun = false;
  }

  /** Umschalten Play/Stopp für eine Quelle */
  isPlaying(sourceId: string) {
    return this.state.playing && this.state.sourceId === sourceId;
  }

  clearError() {
    this.set({ error: null });
  }
}

export const audio = new AudioEngine();

export function usePlayback(): PlaybackState {
  return useSyncExternalStore(audio.subscribe, audio.getState, audio.getState);
}
