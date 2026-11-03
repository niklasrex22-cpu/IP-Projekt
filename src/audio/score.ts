import type { MotifSpec, ScheduledNote } from "./types";

/** Wandelt Skalenstufe in MIDI um (mit Oktavsprüngen für Stufen ausserhalb der Skala). */
export function degreeToMidi(spec: MotifSpec, degree: number, octave: number): number {
  const n = spec.scale.length;
  const oct = Math.floor(degree / n);
  const idx = ((degree % n) + n) % n;
  return spec.rootMidi + 12 * (octave + oct) + spec.scale[idx];
}

export const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

const NOTE_NAMES = ["c", "cis", "d", "dis", "e", "f", "fis", "g", "gis", "a", "b", "h"];
export function midiToName(m: number): string {
  return NOTE_NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
}

export function tokens(pattern: string): string[] {
  return pattern.trim().split(/\s+/).filter(Boolean);
}

export function totalSteps(spec: MotifSpec): number {
  return spec.bars * spec.stepsPerBar;
}

export function stepDuration(spec: MotifSpec): number {
  return 60 / spec.bpm / spec.stepsPerBeat;
}

export function motifDuration(spec: MotifSpec): number {
  return totalSteps(spec) * stepDuration(spec);
}

/** Löst die Textnotation in konkrete Noten auf (Muster werden über die Taktzahl wiederholt). */
export function resolveNotes(spec: MotifSpec): ScheduledNote[] {
  const total = totalSteps(spec);
  const out: ScheduledNote[] = [];
  spec.voices.forEach((v, vi) => {
    const tk = tokens(v.pattern);
    if (!tk.length) return;
    const start = (v.startBar ?? 0) * spec.stepsPerBar;
    let current: ScheduledNote | null = null;
    for (let s = start; s < total; s++) {
      const t = tk[(s - start) % tk.length];
      if (t === "-") {
        if (current) current.lengthSteps++;
        continue;
      }
      current = null;
      if (t === ".") continue;
      const deg = Number(t);
      if (Number.isNaN(deg)) continue;
      current = { voice: vi, midi: degreeToMidi(spec, deg, v.octave), startStep: s, lengthSteps: 1 };
      out.push(current);
    }
  });
  return out.sort((a, b) => a.startStep - b.startStep);
}

export function resolveDrums(spec: MotifSpec): { drum: number; step: number; velocity: number }[] {
  const total = totalSteps(spec);
  const out: { drum: number; step: number; velocity: number }[] = [];
  spec.drums.forEach((d, di) => {
    const p = d.pattern.replace(/\s+/g, "");
    if (!p.length) return;
    for (let s = 0; s < total; s++) {
      const c = p[s % p.length];
      if (c === "x") out.push({ drum: di, step: s, velocity: 1 });
      else if (c === "o") out.push({ drum: di, step: s, velocity: 0.45 });
    }
  });
  return out;
}

/** Melodiekontur (für Visualisierungen ohne Audio, z. B. Klangsignet). */
export function melodyContour(spec: MotifSpec, voice = 0): { t: number; midi: number; len: number }[] {
  const total = totalSteps(spec);
  return resolveNotes(spec)
    .filter((n) => n.voice === voice)
    .map((n) => ({ t: n.startStep / total, midi: n.midi, len: n.lengthSteps / total }));
}
