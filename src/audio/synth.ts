import type { DrumSound, MotifSpec, MusicEvent, Timbre } from "./types";
import { midiToFreq, motifDuration, resolveDrums, resolveNotes, stepDuration } from "./score";

/**
 * Kleine Synthesizer-Bibliothek auf Basis der Web Audio API.
 * Funktioniert sowohl mit AudioContext (Live) als auch OfflineAudioContext (Analyse).
 */

const noiseCache = new WeakMap<BaseAudioContext, AudioBuffer>();
function noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  let b = noiseCache.get(ctx);
  if (!b) {
    b = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noiseCache.set(ctx, b);
  }
  return b;
}

export function createReverb(ctx: BaseAudioContext, seconds = 2.2): ConvolverNode {
  const len = Math.floor(ctx.sampleRate * seconds);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  const conv = ctx.createConvolver();
  conv.buffer = ir;
  return conv;
}

function env(g: AudioParam, t: number, a: number, peak: number, decay: number, sustain: number, end: number, release: number) {
  g.cancelScheduledValues(t);
  g.setValueAtTime(0.0001, t);
  g.linearRampToValueAtTime(peak, t + a);
  g.setTargetAtTime(peak * sustain, t + a, decay / 3);
  g.setTargetAtTime(0.0001, Math.max(end, t + a), release / 3);
}

interface NoteOpts {
  ctx: BaseAudioContext;
  out: AudioNode;
  t: number;
  dur: number;
  midi: number;
  vel: number;
  timbre: Timbre;
  glideFrom?: number;
}

export function playNote({ ctx, out, t, dur, midi, vel, timbre, glideFrom }: NoteOpts) {
  const f = midiToFreq(midi);
  const g = ctx.createGain();
  g.connect(out);
  const end = t + dur;
  const oscs: OscillatorNode[] = [];
  const osc = (type: OscillatorType, freq: number, gain = 1, dest: AudioNode = g) => {
    const o = ctx.createOscillator();
    o.type = type;
    if (glideFrom !== undefined) {
      o.frequency.setValueAtTime(midiToFreq(glideFrom) * (freq / f), t);
      o.frequency.exponentialRampToValueAtTime(freq, t + Math.min(0.14, dur * 0.5));
    } else o.frequency.setValueAtTime(freq, t);
    if (gain !== 1) {
      const og = ctx.createGain();
      og.gain.value = gain;
      o.connect(og).connect(dest);
    } else o.connect(dest);
    oscs.push(o);
    return o;
  };
  let stopAt = end + 1.2;

  switch (timbre) {
    case "marimba": {
      osc("sine", f);
      osc("sine", f * 4, 0.18);
      env(g.gain, t, 0.004, 0.5 * vel, 0.35, 0.0, t + 0.05, 0.5);
      stopAt = t + 1.4;
      break;
    }
    case "glass": {
      osc("sine", f);
      osc("triangle", f * 2, 0.25);
      osc("sine", f * 3.01, 0.08);
      env(g.gain, t, 0.006, 0.32 * vel, 0.6, 0.15, end, 0.8);
      break;
    }
    case "bell": {
      // FM-Glocke
      const car = osc("sine", f);
      const mod = ctx.createOscillator();
      mod.frequency.setValueAtTime(f * 3.5, t);
      const mg = ctx.createGain();
      mg.gain.setValueAtTime(f * 2.2, t);
      mg.gain.exponentialRampToValueAtTime(f * 0.05, t + 1.2);
      mod.connect(mg).connect(car.frequency);
      oscs.push(mod);
      env(g.gain, t, 0.003, 0.28 * vel, 1.4, 0.0, t + 0.1, 1.6);
      stopAt = t + 2.2;
      break;
    }
    case "pluck":
    case "string": {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.Q.value = timbre === "pluck" ? 6 : 1;
      lp.frequency.setValueAtTime(f * 8, t);
      lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + (timbre === "pluck" ? 0.25 : 0.6));
      lp.connect(g);
      osc("sawtooth", f, 0.6, lp);
      osc("square", f * 1.003, 0.25, lp);
      if (timbre === "string") {
        env(g.gain, t, 0.03, 0.22 * vel, 0.4, 0.6, end, 0.4);
      } else {
        env(g.gain, t, 0.002, 0.3 * vel, 0.3, 0.0, t + 0.02, 0.4);
        stopAt = t + 1;
      }
      break;
    }
    case "flute": {
      const o = osc("triangle", f);
      osc("sine", f * 2, 0.12);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 5.5;
      const lg = ctx.createGain();
      lg.gain.setValueAtTime(0, t);
      lg.gain.linearRampToValueAtTime(f * 0.012, t + 0.25);
      lfo.connect(lg).connect(o.frequency);
      oscs.push(lfo);
      // Atemgeräusch
      const n = ctx.createBufferSource();
      n.buffer = noiseBuffer(ctx);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = f * 2;
      bp.Q.value = 2;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.05 * vel, t);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      n.connect(bp).connect(ng).connect(out);
      n.start(t);
      n.stop(t + 0.2);
      env(g.gain, t, 0.05, 0.3 * vel, 0.2, 0.75, end, 0.12);
      stopAt = end + 0.4;
      break;
    }
    case "pad": {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = Math.min(4000, f * 4);
      lp.connect(g);
      osc("sawtooth", f * 0.997, 0.4, lp);
      osc("sawtooth", f * 1.004, 0.4, lp);
      osc("sine", f / 2, 0.5, lp);
      env(g.gain, t, Math.min(0.6, dur * 0.4), 0.16 * vel, 0.5, 0.8, end, 0.9);
      stopAt = end + 1.5;
      break;
    }
    case "reed": {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = f * 3;
      lp.Q.value = 3;
      lp.connect(g);
      osc("square", f, 0.5, lp);
      osc("sawtooth", f * 2.001, 0.15, lp);
      env(g.gain, t, 0.03, 0.22 * vel, 0.2, 0.7, end, 0.15);
      stopAt = end + 0.5;
      break;
    }
    case "bass": {
      osc("sine", f);
      osc("triangle", f * 2, 0.2);
      env(g.gain, t, 0.01, 0.55 * vel, 0.3, 0.6, end, 0.15);
      stopAt = end + 0.5;
      break;
    }
  }
  for (const o of oscs) {
    o.start(t);
    o.stop(stopAt);
  }
}

export function playDrum(ctx: BaseAudioContext, out: AudioNode, sound: DrumSound, t: number, vel: number) {
  const g = ctx.createGain();
  g.connect(out);
  if (sound === "kick") {
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    g.gain.setValueAtTime(0.9 * vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g);
    o.start(t);
    o.stop(t + 0.4);
    return;
  }
  if (sound === "wood" || sound === "rim") {
    const o = ctx.createOscillator();
    o.type = sound === "wood" ? "sine" : "triangle";
    o.frequency.setValueAtTime(sound === "wood" ? 900 : 1700, t);
    g.gain.setValueAtTime(0.35 * vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g);
    o.start(t);
    o.stop(t + 0.08);
    return;
  }
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx);
  const f = ctx.createBiquadFilter();
  if (sound === "hat") {
    f.type = "highpass";
    f.frequency.value = 7000;
    g.gain.setValueAtTime(0.18 * vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  } else {
    // snare
    f.type = "bandpass";
    f.frequency.value = 1800;
    f.Q.value = 0.8;
    g.gain.setValueAtTime(0.45 * vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(220, t);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.25 * vel, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    o.connect(og).connect(out);
    o.start(t);
    o.stop(t + 0.1);
  }
  n.connect(f).connect(g);
  n.start(t);
  n.stop(t + 0.2);
}

/**
 * Plant ein komplettes Motiv ab Zeitpunkt t0 und gibt die musikalischen Ereignisse zurück
 * (diese steuern die Visualisierung – echte Daten statt Zufallsanimation).
 */
export function scheduleMotif(ctx: BaseAudioContext, dest: AudioNode, spec: MotifSpec, t0: number): MusicEvent[] {
  const sd = stepDuration(spec);
  const events: MusicEvent[] = [];
  const dry = ctx.createGain();
  dry.connect(dest);
  const wet = ctx.createGain();
  wet.gain.value = spec.reverb ?? 0.25;
  const rev = createReverb(ctx);
  wet.connect(rev).connect(dest);

  const voiceBus = spec.voices.map((v) => {
    const vg = ctx.createGain();
    vg.gain.value = v.gain ?? 1;
    let node: AudioNode = vg;
    if (typeof ctx.createStereoPanner === "function") {
      const p = ctx.createStereoPanner();
      p.pan.value = v.pan ?? 0;
      vg.connect(p);
      node = p;
    }
    node.connect(dry);
    node.connect(wet);
    return vg;
  });

  const notes = resolveNotes(spec);
  const lastMidi: (number | undefined)[] = [];
  for (const n of notes) {
    const v = spec.voices[n.voice];
    const t = t0 + n.startStep * sd;
    const dur = n.lengthSteps * sd * 0.92;
    const vel = 0.75 + 0.25 * ((n.startStep % spec.stepsPerBeat) === 0 ? 1 : 0);
    playNote({
      ctx,
      out: voiceBus[n.voice],
      t,
      dur,
      midi: n.midi,
      vel,
      timbre: v.timbre,
      glideFrom: v.glide ? lastMidi[n.voice] : undefined,
    });
    lastMidi[n.voice] = n.midi;
    events.push({ time: t, kind: "note", voice: n.voice, midi: n.midi, velocity: vel, duration: dur, step: n.startStep });
  }

  const drumBus = ctx.createGain();
  drumBus.gain.value = 0.8;
  drumBus.connect(dry);
  for (const d of resolveDrums(spec)) {
    const ds = spec.drums[d.drum];
    const t = t0 + d.step * sd;
    playDrum(ctx, drumBus, ds.sound, t, d.velocity * (ds.gain ?? 1));
    events.push({ time: t, kind: "drum", voice: d.drum, velocity: d.velocity, duration: 0.1, step: d.step });
  }
  return events.sort((a, b) => a.time - b.time);
}

/** Rendert ein Motiv offline (für Vergleich & Analyse). */
export async function renderMotif(spec: MotifSpec, sampleRate = 22050): Promise<AudioBuffer> {
  const dur = motifDuration(spec) + 1.5;
  const Offline =
    window.OfflineAudioContext ||
    (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;
  const ctx = new Offline(2, Math.ceil(dur * sampleRate), sampleRate);
  const master = ctx.createGain();
  master.gain.value = 0.8;
  master.connect(ctx.destination);
  scheduleMotif(ctx, master, spec, 0.05);
  return ctx.startRendering();
}
