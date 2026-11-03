import type { AudioAnalysis } from "../audio/analysis";
import { formatTime } from "../lib/hooks";

/**
 * Darstellung einer analysierten Aufnahme: Wellenform, Lautstärkeverlauf,
 * Pausen, Tonhöhe (Schätzung) und Zeitachse mit Laufpunkt.
 */
export function AnalysisView({
  a,
  color,
  progress = 0,
  compact = false,
  showPitch = true,
}: {
  a: AudioAnalysis;
  color: string;
  progress?: number;
  compact?: boolean;
  showPitch?: boolean;
}) {
  const W = 800;
  const H = compact ? 120 : 200;
  const mid = H * 0.42;
  const ov = a.overview;
  const bw = W / ov.length;
  const env = a.envelope;
  const envPath =
    env.length > 1
      ? "M0 " + H + " " + env.map((v, i) => `L${((i / (env.length - 1)) * W).toFixed(1)} ${(H - v * H * 0.3).toFixed(1)}`).join(" ") + ` L${W} ${H} Z`
      : "";
  const pitched = a.pitch.map((p, i) => ({ p, i })).filter((x) => x.p > 0);
  const pMin = 60;
  const pMax = 600;
  const py = (p: number) => mid * 2 - (Math.log(p / pMin) / Math.log(pMax / pMin)) * mid * 1.8;
  const ticks = Math.max(1, Math.round(a.duration));
  const tickStep = ticks > 20 ? 5 : ticks > 8 ? 2 : 1;
  return (
    <div className="analysis">
      <svg viewBox={`0 0 ${W} ${H + 18}`} role="img" aria-label={`Klangwelle: Dauer ${formatTime(a.duration)}, ${a.pauses.length} Pausen erkannt`}>
        {a.pauses.map(([s, e], i) => (
          <rect key={i} x={(s / a.duration) * W} width={((e - s) / a.duration) * W} y={0} height={H} fill="var(--ink)" opacity={0.05} />
        ))}
        <path d={envPath} fill={color} opacity={0.22} />
        {ov.map(([mn, mx], i) => (
          <rect key={i} x={i * bw} width={Math.max(1, bw - 0.6)} y={mid - mx * mid * 0.95} height={Math.max(1, (mx - mn) * mid * 0.95)} fill={color} opacity={i / ov.length <= progress ? 1 : 0.55} rx={0.8} />
        ))}
        {showPitch &&
          pitched.map(({ p, i }) => <circle key={i} cx={(i / Math.max(1, a.pitch.length - 1)) * W} cy={py(p)} r={1.4} fill="var(--ink)" opacity={0.55} />)}
        {Array.from({ length: Math.floor(a.duration / tickStep) + 1 }, (_, i) => i * tickStep).map((t) => (
          <g key={t}>
            <line x1={(t / a.duration) * W} x2={(t / a.duration) * W} y1={H} y2={H + 5} stroke="var(--muted)" />
            <text x={(t / a.duration) * W + 2} y={H + 15} fontSize={10} fill="var(--muted)">
              {t}s
            </text>
          </g>
        ))}
        {progress > 0 && <line x1={progress * W} x2={progress * W} y1={0} y2={H} stroke="var(--ink)" strokeWidth={1.5} />}
      </svg>
      {!compact && (
        <div className="stats">
          <div className="stat">
            <b>{formatTime(a.duration)}</b>
            <span>Dauer</span>
          </div>
          <div className="stat">
            <b>{a.pauses.length}</b>
            <span>Pausen ≥ 0,25 s</span>
          </div>
          <div className="stat">
            <b>{Math.round(a.activeRatio * 100)} %</b>
            <span>Anteil mit Klang</span>
          </div>
          <div className="stat">
            <b>{a.peaksPerSecond.toFixed(1)}</b>
            <span>Lautstärkespitzen / s</span>
          </div>
        </div>
      )}
    </div>
  );
}
