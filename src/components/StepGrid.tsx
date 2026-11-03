import type { MotifSpec } from "../audio/types";
import { tokens } from "../audio/score";

/** Zeigt die Notation des Motivs als Raster (ein Takt-Zyklus jeder Stimme) mit Laufpunkt. */
export function StepGrid({ spec, step }: { spec: MotifSpec; step: number }) {
  const rows = [
    ...spec.voices.map((v) => ({ label: v.label, tk: tokens(v.pattern), start: (v.startBar ?? 0) * spec.stepsPerBar, drum: false })),
    ...spec.drums.map((d) => ({ label: `Schlag: ${d.sound}`, tk: d.pattern.replace(/\s+/g, "").split(""), start: 0, drum: true })),
  ];
  return (
    <div className="stepgrid" role="img" aria-label={`Notationsraster des Motivs ${spec.title}`}>
      {rows.map((r, i) => {
        const len = r.tk.length;
        const rel = step - r.start;
        const cur = step >= r.start ? ((rel % len) + len) % len : -1;
        return (
          <div className="row" key={i}>
            <span title={r.label}>{r.label}</span>
            <div className="cells" style={{ gridTemplateColumns: `repeat(${len}, 1fr)` }}>
              {r.tk.map((t, j) => {
                const on = r.drum ? t === "x" || t === "o" : !Number.isNaN(Number(t));
                const hold = t === "-";
                const bar = j % spec.stepsPerBar === 0;
                return <span key={j} className={`cell ${on ? "on" : ""} ${hold ? "hold" : ""} ${bar ? "bar" : ""} ${cur === j ? "now" : ""}`} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
