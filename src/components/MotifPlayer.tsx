import { useState } from "react";
import { audio, usePlayback } from "../audio/engine";
import { motifFor } from "../audio/motifFor";
import { stepDuration, totalSteps, motifDuration } from "../audio/score";
import type { Canton } from "../data/types";
import { assetUrl, formatTime } from "../lib/hooks";
import { useProgress } from "../lib/useProgress";
import { Badge } from "./Badge";
import { MotifGlyph } from "./MotifGlyph";
import { PlayButton } from "./PlayButton";
import { Visualizer, type VizMode } from "./Visualizer";
import { Icon } from "./Icon";
import { StepGrid } from "./StepGrid";

export function motifSourceId(c: Canton) {
  return `motif:${c.id}`;
}

/** Startet die Musik eines Kantons: eigene Datei (falls vorhanden), sonst Demo-Motiv. */
export function playCantonMusic(c: Canton) {
  if (c.music?.audioUrl) void audio.playFile(motifSourceId(c), assetUrl(c.music.audioUrl), c.id, c.music.title);
  else void audio.playMotif(motifSourceId(c), motifFor(c), c.id);
}

export function MotifPlayer({ canton, vizHeight = 220, showGrid = false }: { canton: Canton; vizHeight?: number; showGrid?: boolean }) {
  const spec = motifFor(canton);
  const [mode, setMode] = useState<VizMode>("rhythm");
  const sid = motifSourceId(canton);
  const { elapsed, active } = useProgress(sid);
  const pb = usePlayback();
  const hasFile = !!canton.music?.audioUrl;
  const step = active && !hasFile ? Math.floor(elapsed / stepDuration(spec)) % totalSteps(spec) : -1;
  const dur = hasFile ? pb.duration : motifDuration(spec);

  return (
    <div className="motif-player" style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <PlayButton sourceId={sid} label={hasFile ? "Musik abspielen" : "Klangmotiv abspielen"} onPlay={() => playCantonMusic(canton)} />
          <span className="muted" style={{ fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
            {formatTime(elapsed)} / {formatTime(dur)}
          </span>
        </div>
        <div className="segmented" role="group" aria-label="Visualisierungsmodus">
          <button type="button" aria-pressed={mode === "wave"} onClick={() => setMode("wave")}>
            <Icon name="wave" size={14} /> Welle
          </button>
          <button type="button" aria-pressed={mode === "rhythm"} onClick={() => setMode("rhythm")}>
            <Icon name="rhythm" size={14} /> Rhythmus
          </button>
        </div>
      </div>

      <Visualizer mode={mode} color={canton.color} height={vizHeight} label={`Visualisierung ${canton.name}`} />

      {!hasFile && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500 }}>«{spec.title}»</strong>
            <Badge v={spec.generated ? "platzhalter" : "eigen"} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span className="chip">{spec.meter}-Takt</span>
            <span className="chip">{spec.bpm} BPM</span>
            <span className="chip">{spec.scaleName}</span>
            <span className="chip">{spec.voices.length} Stimmen</span>
            <span className="chip">≈ {Math.round(motifDuration(spec))} s</span>
          </div>
          <MotifGlyph spec={spec} color={canton.color} activeStep={step} height={90} />
          {showGrid && <StepGrid spec={spec} step={step} />}
          <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
            <strong>Wie der Klang gestaltet wurde: </strong>
            {spec.idea}
          </p>
          <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
            <strong>Verbindung zur Gestaltung: </strong>
            {spec.visualLink}
          </p>
          <p className="muted" style={{ fontSize: 12 }}>
            Demo-Klang, erzeugt mit der Web Audio API. Künstlerische Interpretation – keine traditionelle Musik des Kantons.
          </p>
        </>
      )}
      {hasFile && (
        <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
          <strong>{canton.music!.title}</strong>
          {canton.music!.composer && <> · {canton.music!.composer}</>}
          {canton.music!.description && <> — {canton.music!.description}</>}
        </p>
      )}
    </div>
  );
}
