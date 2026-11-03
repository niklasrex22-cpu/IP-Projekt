import { useEffect, useRef } from "react";
import { audio, usePlayback } from "../audio/engine";
import { useReducedMotion } from "../lib/hooks";

export type VizMode = "wave" | "rhythm";

interface Burst {
  born: number;
  angle: number;
  radius: number;
  size: number;
  drum: boolean;
  hue: number;
}

/**
 * Audio-Visualisierung auf Basis ECHTER Audiodaten:
 *  - «wave»:   Zeitbereichsdaten des AnalyserNode (Wellenform) + Lautstärke-Verlauf
 *  - «rhythm»: Frequenzbänder als Ringe + Formen für jedes tatsächlich gespielte
 *              Musikereignis (Note → Kreis, Schlag → Puls). Bei Audiodateien werden
 *              Ereignisse über Lautstärkesprünge (Onsets) erkannt.
 */
export function Visualizer({
  mode,
  color,
  height = 260,
  label = "Audio-Visualisierung",
}: {
  mode: VizMode;
  color: string;
  height?: number;
  label?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pb = usePlayback();
  const reduced = useReducedMotion();
  const colorRef = useRef(color);
  colorRef.current = color;
  const bursts = useRef<Burst[]>([]);
  const history = useRef<number[]>([]);

  // Musikereignisse → Formen
  useEffect(() => {
    return audio.onMusicEvent((e) => {
      const b = bursts.current;
      if (b.length > 80) b.shift();
      const midi = e.midi ?? 48;
      b.push({
        born: performance.now(),
        angle: e.kind === "drum" ? 0 : ((midi % 12) / 12) * Math.PI * 2 - Math.PI / 2,
        radius: e.kind === "drum" ? 0 : 0.35 + ((midi - 36) / 60) * 0.6,
        size: e.kind === "drum" ? 1 : 0.4 + e.duration * 0.6,
        drum: e.kind === "drum",
        hue: e.voice,
      });
    });
  }, []);

  useEffect(() => {
    const canvas = ref.current!;
    const g = canvas.getContext("2d")!;
    let raf = 0;
    let last = 0;
    let lastLevel = 0;
    const time = new Uint8Array(2048);
    const freq = new Uint8Array(1024);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      // Auf schwächeren Geräten / bei reduzierter Bewegung: 30 fps
      if (reduced && now - last < 33) return;
      last = now;
      const W = canvas.width;
      const H = canvas.height;
      const c = colorRef.current;
      const an = audio.getAnalyser();
      const playing = audio.state.playing && !!an;
      g.clearRect(0, 0, W, H);

      let level = 0;
      if (playing && an) {
        an.getByteTimeDomainData(time);
        an.getByteFrequencyData(freq);
        let s = 0;
        for (let i = 0; i < time.length; i++) {
          const v = (time[i] - 128) / 128;
          s += v * v;
        }
        level = Math.sqrt(s / time.length);
        // Onset-Erkennung für Dateien/Aufnahmen
        if (audio.state.kind !== "motif" && level > 0.04 && level > lastLevel * 1.35 + 0.01) {
          bursts.current.push({ born: now, angle: Math.random() * Math.PI * 2, radius: 0.5 + level, size: 0.6, drum: level > 0.15, hue: 0 });
        }
      } else {
        time.fill(128);
        freq.fill(0);
      }
      lastLevel = lastLevel * 0.7 + level * 0.3;
      const hist = history.current;
      hist.push(level);
      if (hist.length > 240) hist.shift();

      if (mode === "wave") {
        // Lautstärkeverlauf (Hüllkurve) im Hintergrund
        g.fillStyle = c;
        g.globalAlpha = 0.14;
        const bw = W / 240;
        for (let i = 0; i < hist.length; i++) {
          const h = Math.min(1, hist[i] * 3.2) * H * 0.9;
          g.fillRect(i * bw, (H - h) / 2, Math.max(1, bw - dpr), h);
        }
        g.globalAlpha = 1;
        // Mittellinie
        g.strokeStyle = "rgba(29,26,23,.15)";
        g.lineWidth = dpr;
        g.beginPath();
        g.moveTo(0, H / 2);
        g.lineTo(W, H / 2);
        g.stroke();
        // Wellenform (2 Schichten für Tiefe)
        for (let layer = 0; layer < 2; layer++) {
          g.strokeStyle = layer === 0 ? c : "rgba(29,26,23,.85)";
          g.globalAlpha = layer === 0 ? 0.35 : 1;
          g.lineWidth = (layer === 0 ? 7 : 2) * dpr;
          g.lineJoin = "round";
          g.beginPath();
          const step = 2;
          for (let i = 0; i < time.length; i += step) {
            const x = (i / (time.length - 1)) * W;
            const v = (time[i] - 128) / 128;
            const y = H / 2 + v * H * 0.42 * (layer === 0 ? 1.05 : 1);
            if (i === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
          }
          g.stroke();
        }
        g.globalAlpha = 1;
      } else {
        const cx = W / 2;
        const cy = H / 2;
        const R = Math.min(W, H) * 0.46;
        // Frequenzbänder als konzentrische Ringe
        const bands = 7;
        for (let b = bands - 1; b >= 0; b--) {
          const from = Math.floor(Math.pow(b / bands, 2) * 300) + 2;
          const to = Math.floor(Math.pow((b + 1) / bands, 2) * 300) + 3;
          let s = 0;
          for (let i = from; i < to; i++) s += freq[i];
          const v = s / (to - from) / 255;
          g.beginPath();
          g.arc(cx, cy, R * (0.2 + (b / bands) * 0.75) + v * R * 0.08, 0, Math.PI * 2);
          g.strokeStyle = c;
          g.globalAlpha = 0.08 + v * 0.7;
          g.lineWidth = (1 + v * 10) * dpr;
          g.stroke();
        }
        g.globalAlpha = 1;
        // Ereignisse
        const life = reduced ? 700 : 1400;
        bursts.current = bursts.current.filter((b) => now - b.born < life);
        for (const b of bursts.current) {
          const t = (now - b.born) / life;
          if (b.drum) {
            g.beginPath();
            g.arc(cx, cy, R * (0.12 + t * (reduced ? 0.2 : 0.9)), 0, Math.PI * 2);
            g.strokeStyle = "rgba(29,26,23,1)";
            g.globalAlpha = (1 - t) * 0.6;
            g.lineWidth = 2.5 * dpr * (1 - t);
            g.stroke();
          } else {
            const rr = R * b.radius;
            const x = cx + Math.cos(b.angle) * rr;
            const y = cy + Math.sin(b.angle) * rr;
            const size = R * 0.08 * b.size * (1 + (reduced ? 0 : t * 1.6));
            g.beginPath();
            if (b.hue % 3 === 1) g.rect(x - size, y - size, size * 2, size * 2);
            else if (b.hue % 3 === 2) {
              g.moveTo(x, y - size);
              g.lineTo(x + size, y + size);
              g.lineTo(x - size, y + size);
              g.closePath();
            } else g.arc(x, y, size, 0, Math.PI * 2);
            g.fillStyle = b.hue === 0 ? c : "rgba(29,26,23,1)";
            g.globalAlpha = (1 - t) * (b.hue === 0 ? 0.9 : 0.55);
            g.fill();
          }
        }
        g.globalAlpha = 1;
        // Zentrum pulsiert mit der Lautstärke
        g.beginPath();
        g.arc(cx, cy, R * (0.08 + Math.min(1, level * 3) * 0.12), 0, Math.PI * 2);
        g.fillStyle = c;
        g.fill();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [mode, reduced]);

  return (
    <div className="viz" style={{ height }}>
      <canvas ref={ref} role="img" aria-label={`${label} (${mode === "wave" ? "Wellenform" : "Rhythmus"})${pb.playing ? ": " + pb.title : ""}`} />
      {!pb.playing && (
        <div className="viz-idle" aria-hidden="true">
          Stille – starte einen Klang
        </div>
      )}
    </div>
  );
}
