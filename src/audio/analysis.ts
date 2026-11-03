/**
 * Einfache, nachvollziehbare Audioanalyse für Sprach- und Musikaufnahmen.
 * Alle Werte werden direkt aus den Audiodaten berechnet – es werden
 * KEINE Aussagen über «typische» Eigenschaften von Kantonen abgeleitet.
 */

export interface AudioAnalysis {
  duration: number;
  /** Zeitauflösung der Hüllkurve in Sekunden */
  hop: number;
  /** RMS-Lautstärke pro Fenster, normiert 0…1 */
  envelope: number[];
  /** Geschätzte Grundfrequenz pro Fenster in Hz (0 = keine Tonhöhe erkannt) */
  pitch: number[];
  /** Erkannte Pausen in Sekunden [start, ende] */
  pauses: [number, number][];
  /** Anteil der Zeit mit Klang (ohne Pausen), 0…1 */
  activeRatio: number;
  /** Lautstärkespitzen («Klangereignisse») pro Sekunde */
  peaksPerSecond: number;
  /** Zeitpunkte der Lautstärkespitzen */
  peaks: number[];
  /** Kleine Wellenform-Übersicht (min/max-Paare) */
  overview: [number, number][];
}

function mono(buf: AudioBuffer): Float32Array {
  if (buf.numberOfChannels === 1) return buf.getChannelData(0);
  const a = buf.getChannelData(0);
  const b = buf.getChannelData(1);
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = (a[i] + b[i]) / 2;
  return out;
}

/** Autokorrelations-Tonhöhenschätzung für ein Fenster (60–800 Hz). */
function estimatePitch(x: Float32Array, start: number, size: number, sr: number): number {
  const minLag = Math.floor(sr / 800);
  const maxLag = Math.floor(sr / 60);
  if (start + size + maxLag >= x.length) return 0;
  let energy = 0;
  for (let i = 0; i < size; i++) energy += x[start + i] * x[start + i];
  if (energy < 1e-4 * size) return 0;
  let best = 0;
  let bestLag = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    for (let i = 0; i < size; i += 2) s += x[start + i] * x[start + i + lag];
    if (s > best) {
      best = s;
      bestLag = lag;
    }
  }
  const norm = best / (energy / 2);
  return norm > 0.45 && bestLag ? sr / bestLag : 0;
}

export function analyzeBuffer(buf: AudioBuffer, opts: { hop?: number; pauseMin?: number } = {}): AudioAnalysis {
  const hop = opts.hop ?? 0.02;
  const pauseMin = opts.pauseMin ?? 0.25;
  const sr = buf.sampleRate;
  const x = mono(buf);
  const hopS = Math.max(1, Math.floor(hop * sr));
  const frames = Math.floor(x.length / hopS);
  const rms: number[] = new Array(frames);
  let max = 1e-9;
  for (let f = 0; f < frames; f++) {
    let s = 0;
    const o = f * hopS;
    for (let i = 0; i < hopS; i++) s += x[o + i] * x[o + i];
    rms[f] = Math.sqrt(s / hopS);
    if (rms[f] > max) max = rms[f];
  }
  const envelope = rms.map((v) => v / max);

  // Tonhöhe nur in jedem 2. Fenster (Performance), dann auffüllen
  const pitch: number[] = new Array(frames).fill(0);
  const win = Math.floor(sr * 0.03);
  for (let f = 0; f < frames; f += 2) {
    if (envelope[f] > 0.08) pitch[f] = estimatePitch(x, f * hopS, win, sr);
    if (f + 1 < frames) pitch[f + 1] = pitch[f];
  }

  // Pausen: Lautstärke unter Schwelle für mindestens pauseMin Sekunden
  const thr = 0.06;
  const pauses: [number, number][] = [];
  let runStart = -1;
  for (let f = 0; f <= frames; f++) {
    const quiet = f < frames && envelope[f] < thr;
    if (quiet && runStart < 0) runStart = f;
    if (!quiet && runStart >= 0) {
      const len = (f - runStart) * hop;
      if (len >= pauseMin) pauses.push([runStart * hop, f * hop]);
      runStart = -1;
    }
  }
  const pauseTime = pauses.reduce((a, [s, e]) => a + (e - s), 0);
  const duration = buf.duration;

  // Spitzen (lokale Maxima der geglätteten Hüllkurve)
  const smooth = envelope.map((_, i) => {
    let s = 0;
    let n = 0;
    for (let k = -2; k <= 2; k++) {
      const v = envelope[i + k];
      if (v !== undefined) {
        s += v;
        n++;
      }
    }
    return s / n;
  });
  const peaks: number[] = [];
  let lastPeak = -1;
  for (let i = 1; i < smooth.length - 1; i++) {
    if (smooth[i] > 0.2 && smooth[i] >= smooth[i - 1] && smooth[i] > smooth[i + 1] && (i - lastPeak) * hop > 0.1) {
      peaks.push(i * hop);
      lastPeak = i;
    }
  }

  const bins = 400;
  const per = Math.max(1, Math.floor(x.length / bins));
  const overview: [number, number][] = [];
  for (let b = 0; b < bins; b++) {
    let mn = 1;
    let mx = -1;
    for (let i = b * per; i < Math.min(x.length, (b + 1) * per); i++) {
      if (x[i] < mn) mn = x[i];
      if (x[i] > mx) mx = x[i];
    }
    overview.push([mn, mx]);
  }

  return {
    duration,
    hop,
    envelope,
    pitch,
    pauses,
    activeRatio: duration ? Math.max(0, 1 - pauseTime / duration) : 0,
    peaksPerSecond: duration ? peaks.length / duration : 0,
    peaks,
    overview,
  };
}

export async function decodeFile(ctx: BaseAudioContext, data: ArrayBuffer): Promise<AudioBuffer> {
  return await ctx.decodeAudioData(data.slice(0));
}
