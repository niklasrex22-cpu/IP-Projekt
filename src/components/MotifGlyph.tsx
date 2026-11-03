import { useMemo } from "react";
import type { MotifSpec } from "../audio/types";
import { resolveNotes, totalSteps } from "../audio/score";

/**
 * «Klangsignet»: grafische Partitur, direkt aus den Noten des Motivs berechnet.
 * x = Zeit, y = Tonhöhe, Strichstärke = Notenlänge, Farbe = Stimme.
 * → Die Bildgestaltung entsteht aus der Musik (BG ↔ Musik).
 */
export function MotifGlyph({
  spec,
  color,
  width = 320,
  height = 120,
  activeStep = -1,
  title,
}: {
  spec: MotifSpec;
  color: string;
  width?: number;
  height?: number;
  activeStep?: number;
  title?: string;
}) {
  const { notes, minM, maxM, total } = useMemo(() => {
    const notes = resolveNotes(spec);
    const ms = notes.map((n) => n.midi);
    return { notes, minM: Math.min(...ms, 60), maxM: Math.max(...ms, 72), total: totalSteps(spec) };
  }, [spec]);
  const pad = 8;
  const x = (s: number) => pad + (s / total) * (width - pad * 2);
  const y = (m: number) => height - pad - ((m - minM) / Math.max(1, maxM - minM)) * (height - pad * 2);
  const voices = spec.voices.length;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={title ?? `Grafische Partitur: ${spec.title}`} className="motif-glyph">
      {Array.from({ length: spec.bars + 1 }, (_, b) => (
        <line key={b} x1={x(b * spec.stepsPerBar)} x2={x(b * spec.stepsPerBar)} y1={pad} y2={height - pad} stroke="currentColor" strokeOpacity={0.08} />
      ))}
      {notes.map((n, i) => {
        const on = activeStep >= n.startStep && activeStep < n.startStep + n.lengthSteps;
        const op = 1 - (n.voice / Math.max(1, voices)) * 0.55;
        return (
          <line
            key={i}
            x1={x(n.startStep)}
            x2={Math.max(x(n.startStep) + 2, x(n.startStep + n.lengthSteps) - 1.5)}
            y1={y(n.midi)}
            y2={y(n.midi)}
            stroke={on ? "var(--ink)" : color}
            strokeOpacity={on ? 1 : op}
            strokeWidth={on ? 6 : 3.5 + (n.voice === 0 ? 1.5 : 0)}
            strokeLinecap="round"
          />
        );
      })}
      {activeStep >= 0 && <line x1={x(activeStep)} x2={x(activeStep)} y1={0} y2={height} stroke="var(--ink)" strokeWidth={1} strokeOpacity={0.5} />}
    </svg>
  );
}
