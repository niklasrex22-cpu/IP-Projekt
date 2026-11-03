import { useEffect, useRef, useState } from "react";
import { audio } from "../audio/engine";
import { analyzeBuffer, decodeFile, type AudioAnalysis } from "../audio/analysis";
import { AnalysisView } from "../components/AnalysisView";
import { Icon } from "../components/Icon";
import { MotifPlayer, playCantonMusic } from "../components/MotifPlayer";
import { PlayButton } from "../components/PlayButton";
import { Visualizer } from "../components/Visualizer";
import { CANTONS, CANTON_BY_ID, FEATURED_IDS } from "../data/cantons";
import { useAccent } from "../lib/hooks";
import { href, replaceRoute } from "../lib/router";
import { useProgress } from "../lib/useProgress";

interface Clip {
  name: string;
  buffer: AudioBuffer;
  analysis: AudioAnalysis;
}

/** Eigene Sprachaufnahme (Mikrofon oder Datei) analysieren – Sprache als Klangwelle. */
function SpeechLab({ color }: { color: string }) {
  const [clip, setClip] = useState<Clip | null>(null);
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const chunks = useRef<Blob[]>([]);
  const sid = "lab:clip";
  const { progress } = useProgress(sid);

  useEffect(() => {
    if (!rec) return;
    const t0 = Date.now();
    const iv = setInterval(() => {
      const s = (Date.now() - t0) / 1000;
      setSeconds(s);
      if (s > 30) rec.stop();
    }, 200);
    return () => clearInterval(iv);
  }, [rec]);

  const load = async (data: ArrayBuffer, name: string) => {
    setBusy(true);
    setErr(null);
    try {
      const ctx = audio.ensure();
      const buffer = await decodeFile(ctx, data);
      setClip({ name, buffer, analysis: analyzeBuffer(buffer) });
    } catch {
      setErr("Die Datei konnte nicht gelesen werden. Unterstützt werden u. a. MP3, WAV, OGG und M4A.");
    } finally {
      setBusy(false);
    }
  };

  const startRec = async () => {
    setErr(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setErr("Dein Browser unterstützt keine Mikrofonaufnahme. Lade stattdessen eine Audiodatei hoch.");
      return;
    }
    try {
      audio.stop();
      audio.ensure();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const r = new MediaRecorder(stream);
      chunks.current = [];
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRec(null);
        const blob = new Blob(chunks.current, { type: r.mimeType });
        await load(await blob.arrayBuffer(), `Aufnahme ${new Date().toLocaleTimeString("de-CH")}`);
      };
      r.start();
      setSeconds(0);
      setRec(r);
    } catch {
      setErr("Kein Zugriff auf das Mikrofon. Bitte im Browser erlauben – oder eine Datei hochladen.");
    }
  };

  return (
    <div className="card pad speech-lab" style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {rec ? (
          <button type="button" className="btn accent" onClick={() => rec.stop()}>
            <Icon name="stop" /> Aufnahme beenden ({seconds.toFixed(0)} s)
          </button>
        ) : (
          <button type="button" className="btn" onClick={startRec} disabled={busy}>
            <Icon name="mic" /> Mit Mikrofon aufnehmen
          </button>
        )}
        <label className="btn ghost" style={{ cursor: "pointer" }}>
          <Icon name="upload" /> Audiodatei wählen
          <input
            type="file"
            accept="audio/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) await load(await f.arrayBuffer(), f.name);
              e.target.value = "";
            }}
          />
        </label>
        {clip && <PlayButton sourceId={sid} label="Abspielen" variant="ghost" onPlay={() => audio.playBuffer(sid, clip.buffer, null, clip.name)} />}
      </div>
      {rec && (
        <div className="rec-indicator" role="status">
          <span className="rec-dot" /> Aufnahme läuft … sprich einen Satz in deinem Dialekt (max. 30 s).
        </div>
      )}
      {busy && <p className="muted">Analysiere …</p>}
      {err && (
        <div className="error-msg" role="alert">
          {err}
        </div>
      )}
      {clip ? (
        <>
          <strong>{clip.name}</strong>
          <AnalysisView a={clip.analysis} color={color} progress={progress} />
          <p className="muted" style={{ fontSize: 13 }}>
            Dunkle Balken = Wellenform · farbige Fläche unten = Lautstärkeverlauf · graue Felder = erkannte Pausen (≥ 0,25 s) · Punkte = geschätzte
            Tonhöhe (Sprachmelodie). Die Werte beschreiben nur diese eine Aufnahme – sie sagen nichts über «typische» Sprechweisen eines Kantons aus.
          </p>
        </>
      ) : (
        <div className="placeholder-box">
          Noch keine Aufnahme. Die Aufnahme bleibt auf deinem Gerät – sie wird nicht hochgeladen oder gespeichert.
        </div>
      )}
    </div>
  );
}

export function SoundLabPage({ cantonId }: { cantonId?: string }) {
  const canton = CANTON_BY_ID[cantonId ?? ""] ?? CANTON_BY_ID.be;
  useAccent(canton.color);

  return (
    <div className="wrap section lab">
      <div className="section-head">
        <p className="eyebrow">Klanglabor</p>
        <h1 className="h2">Musik wird Form. Sprache wird Welle.</h1>
        <p className="lead">
          Hier lassen sich die Klangmotive genauer untersuchen: als Wellenform, als Rhythmusbild und als Partitur. Unten kannst du deine eigene Stimme
          aufnehmen und als Klangwelle sichtbar machen.
        </p>
      </div>

      <div className="lab-picker">
        <label htmlFor="lab-canton" className="eyebrow">
          Kanton
        </label>
        <select
          id="lab-canton"
          className="select"
          value={canton.id}
          onChange={(e) => {
            const was = audio.state.playing && audio.state.sourceId?.startsWith("motif:");
            replaceRoute("klanglabor", e.target.value);
            if (was) playCantonMusic(CANTON_BY_ID[e.target.value]);
          }}
        >
          {CANTONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {FEATURED_IDS.includes(c.id) ? "★" : "(Platzhalter-Motiv)"}
            </option>
          ))}
        </select>
        <div className="lab-quick">
          {FEATURED_IDS.map((id) => {
            const c = CANTON_BY_ID[id];
            return (
              <button
                key={id}
                type="button"
                className={`swatch ${id === canton.id ? "on" : ""}`}
                style={{ ["--c" as string]: c.color }}
                onClick={() => {
                  replaceRoute("klanglabor", id);
                  playCantonMusic(c);
                }}
                aria-label={`${c.name}: Motiv abspielen`}
              >
                {c.abbreviation}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lab-grid">
        <div className="card pad">
          <MotifPlayer key={canton.id} canton={canton} vizHeight={320} showGrid />
          <p style={{ marginTop: 14 }}>
            <a href={href("karte", canton.id)} className="btn ghost sm">
              {canton.name} auf der Karte <Icon name="arrow" size={14} />
            </a>
          </p>
        </div>
        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <div className="card pad">
            <p className="eyebrow" style={{ marginBottom: 10 }}>
              Zweite Ansicht – Wellenform
            </p>
            <Visualizer mode="wave" color={canton.color} height={160} />
          </div>
          <div className="card pad" style={{ fontSize: 14, display: "grid", gap: 10 }}>
            <p className="eyebrow">So funktioniert die Visualisierung</p>
            <p>
              <strong>Welle:</strong> zeigt die Schwingung der Luft (Zeitbereich) – gemessen vom <em>AnalyserNode</em> der Web Audio API, ca. 60 Mal pro
              Sekunde. Dahinter: der Lautstärkeverlauf der letzten Sekunden.
            </p>
            <p>
              <strong>Rhythmus:</strong> Jede gespielte Note erzeugt eine Form – ihre Position im Kreis entspricht der Tonhöhe (Tonklasse), ihre Grösse
              der Notenlänge. Jeder Schlag lässt einen Ring vom Zentrum aus wachsen. Die Ringe zeigen die Energie in sieben Frequenzbändern.
            </p>
            <p>
              <strong>Partitur:</strong> Das Raster zeigt die Notation des Motivs; der dunkle Punkt läuft synchron mit der Musik.
            </p>
          </div>
        </div>
      </div>

      <div className="section-head" style={{ marginTop: 72 }}>
        <p className="eyebrow">Dialekt & Rhythmus</p>
        <h2 className="h2">Deine Stimme als Klangwelle</h2>
        <p className="lead">
          Nimm einen Satz auf oder lade eine Dialektaufnahme. Die Analyse zeigt Lautstärke, Pausen, zeitlichen Verlauf und die Sprachmelodie.
        </p>
      </div>
      <SpeechLab color={canton.color} />
    </div>
  );
}
