import { useEffect, useMemo, useState } from "react";
import { audio, usePlayback } from "../audio/engine";
import { analyzeBuffer, type AudioAnalysis } from "../audio/analysis";
import { motifFor } from "../audio/motifFor";
import { motifDuration, resolveDrums, resolveNotes, stepDuration } from "../audio/score";
import { renderMotif } from "../audio/synth";
import { WordCard } from "../components/CantonDetail";
import { Icon } from "../components/Icon";
import { LangChips } from "../components/LangChips";
import { MotifGlyph } from "../components/MotifGlyph";
import { motifSourceId, playCantonMusic } from "../components/MotifPlayer";
import { PlayButton } from "../components/PlayButton";
import { SwissMap } from "../components/SwissMap";
import { Visualizer } from "../components/Visualizer";
import { Wappen } from "../components/Wappen";
import { CANTONS, CANTON_BY_ID } from "../data/cantons";
import type { Canton } from "../data/types";
import { assetUrl, useAccent } from "../lib/hooks";
import { href, replaceRoute } from "../lib/router";
import { useProgress } from "../lib/useProgress";

/** Offline-Analyse eines Demo-Motivs (Lautstärkeverlauf aus echtem gerendertem Audio). */
function useMotifAnalysis(c: Canton): AudioAnalysis | null {
  const [a, setA] = useState<AudioAnalysis | null>(null);
  useEffect(() => {
    let cancel = false;
    setA(null);
    if (c.music?.audioUrl) return; // eigene Dateien werden hier nicht vorab gerendert
    renderMotif(motifFor(c))
      .then((buf) => !cancel && setA(analyzeBuffer(buf, { hop: 0.05 })))
      .catch(() => !cancel && setA(null));
    return () => {
      cancel = true;
    };
  }, [c]);
  return a;
}

function Column({ c, side, onChange }: { c: Canton; side: "a" | "b"; onChange: (id: string) => void }) {
  const pb = usePlayback();
  const active = pb.playing && pb.sourceId === motifSourceId(c);
  const realWords = c.words.filter((w) => w.verification !== "platzhalter");
  const recs = c.audioExamples.filter((r) => r.audioUrl);
  const spec = motifFor(c);
  return (
    <div className={`cmp-col ${active ? "is-playing" : ""}`} style={{ ["--c" as string]: c.color }}>
      <label className="sr-only" htmlFor={`cmp-${side}`}>
        Kanton {side === "a" ? "links" : "rechts"}
      </label>
      <select id={`cmp-${side}`} className="select" value={c.id} onChange={(e) => onChange(e.target.value)}>
        {CANTONS.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
      <div className="cmp-hero">
        <div>
          <span className="abbr">{c.abbreviation}</span>
          <h2>{c.name}</h2>
          <LangChips langs={c.languages} />
        </div>
        <Wappen canton={c} size={56} />
      </div>
      <div className="cmp-block">
        <div className="eyebrow">Klangmotiv</div>
        <PlayButton sourceId={motifSourceId(c)} label={`${c.name} anhören`} onPlay={() => playCantonMusic(c)} />
        <MotifGlyph spec={spec} color={c.color} height={70} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span className="chip">{spec.meter}</span>
          <span className="chip">{spec.bpm} BPM</span>
          <span className="chip">{spec.scaleName}</span>
        </div>
        {active && <Visualizer mode="wave" color={c.color} height={110} />}
      </div>
      <div className="cmp-block">
        <div className="eyebrow">Typische Wörter</div>
        {realWords.length ? (
          <div className="words">
            {realWords.slice(0, 4).map((w, i) => (
              <WordCard key={i} w={w} canton={c} />
            ))}
          </div>
        ) : (
          <div className="placeholder-box">Für {c.name} sind noch keine recherchierten Wörter eingetragen.</div>
        )}
      </div>
      <div className="cmp-block">
        <div className="eyebrow">Sprachaufnahmen</div>
        {recs.length ? (
          recs.map((r) => {
            const sid = `rec:${c.id}:${r.id}`;
            return <PlayButton key={r.id} sourceId={sid} variant="ghost" label={r.title} onPlay={() => void audio.playFile(sid, assetUrl(r.audioUrl!), c.id, r.title)} />;
          })
        ) : (
          <div className="placeholder-box">Noch keine Aufnahme vorhanden – Platzhalter.</div>
        )}
      </div>
      <a className="btn ghost sm" href={href("karte", c.id)}>
        Detailansicht <Icon name="arrow" size={14} />
      </a>
    </div>
  );
}

/** Gegenüberstellung von Lautstärkeverlauf, Tonhöhe (Partitur) und Rhythmus. */
function CompareCharts({ a, b }: { a: Canton; b: Canton }) {
  const ea = useMotifAnalysis(a);
  const eb = useMotifAnalysis(b);
  const pa = useProgress(motifSourceId(a));
  const pbp = useProgress(motifSourceId(b));
  const sa = motifFor(a);
  const sb = motifFor(b);
  const maxDur = Math.max(motifDuration(sa), motifDuration(sb));
  const W = 800;

  const envPath = (an: AudioAnalysis | null, h: number, off: number, flip: boolean) => {
    if (!an) return "";
    const pts = an.envelope.map((v, i) => {
      const t = i * an.hop;
      const x = (t / maxDur) * W;
      const y = flip ? off + v * h : off - v * h;
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    });
    return `M0 ${off} L${pts.join(" L")} L${((an.envelope.length * an.hop) / maxDur) * W} ${off} Z`;
  };

  const pitchLines = useMemo(() => {
    const mk = (s: ReturnType<typeof motifFor>) =>
      resolveNotes(s)
        .filter((n) => n.voice === 0)
        .map((n) => ({ t0: n.startStep * stepDuration(s), t1: (n.startStep + n.lengthSteps) * stepDuration(s), m: n.midi }));
    return { a: mk(sa), b: mk(sb) };
  }, [sa, sb]);
  const allM = [...pitchLines.a, ...pitchLines.b].map((n) => n.m);
  const mMin = Math.min(...allM) - 1;
  const mMax = Math.max(...allM) + 1;
  const PH = 160;
  const py = (m: number) => PH - 10 - ((m - mMin) / (mMax - mMin)) * (PH - 20);

  const onsets = (s: ReturnType<typeof motifFor>) => {
    const sd = stepDuration(s);
    const set = new Set<number>();
    resolveNotes(s).forEach((n) => set.add(n.startStep));
    resolveDrums(s).forEach((d) => set.add(d.step));
    return [...set].map((st) => st * sd);
  };

  const head = (prog: number, dur: number) => (prog > 0 ? (prog * dur) / maxDur * W : -10);

  return (
    <div className="grid-3 cmp-charts">
      <figure className="card pad">
        <figcaption className="eyebrow">Lautstärkeverlauf</figcaption>
        <svg viewBox={`0 0 ${W} 200`} role="img" aria-label={`Lautstärkeverlauf ${a.name} (oben) und ${b.name} (unten)`}>
          <path d={envPath(ea, 90, 98, false)} fill={a.color} opacity={0.8} />
          <path d={envPath(eb, 90, 102, true)} fill={b.color} opacity={0.8} />
          <line x1={0} x2={W} y1={100} y2={100} stroke="var(--ink)" strokeOpacity={0.3} />
          <line x1={head(pa.progress, motifDuration(sa))} x2={head(pa.progress, motifDuration(sa))} y1={0} y2={100} stroke="var(--ink)" />
          <line x1={head(pbp.progress, motifDuration(sb))} x2={head(pbp.progress, motifDuration(sb))} y1={100} y2={200} stroke="var(--ink)" />
        </svg>
        <p className="muted cap">
          Aus dem tatsächlich gerenderten Audio berechnet (RMS). Oben {a.name}, unten {b.name}.{(!ea || !eb) && " Berechne …"}
        </p>
      </figure>
      <figure className="card pad">
        <figcaption className="eyebrow">Tonhöhe der Melodie</figcaption>
        <svg viewBox={`0 0 ${W} ${PH}`} role="img" aria-label="Tonhöhenverlauf der Hauptstimmen beider Motive">
          {pitchLines.a.map((n, i) => (
            <line key={"a" + i} x1={(n.t0 / maxDur) * W} x2={(n.t1 / maxDur) * W - 2} y1={py(n.m)} y2={py(n.m)} stroke={a.color} strokeWidth={5} strokeLinecap="round" />
          ))}
          {pitchLines.b.map((n, i) => (
            <line key={"b" + i} x1={(n.t0 / maxDur) * W} x2={(n.t1 / maxDur) * W - 2} y1={py(n.m) + 3} y2={py(n.m) + 3} stroke={b.color} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
          ))}
        </svg>
        <p className="muted cap">Aus der Partitur der Hauptstimme: waagrecht die Zeit, senkrecht die Tonhöhe.</p>
      </figure>
      <figure className="card pad">
        <figcaption className="eyebrow">Rhythmus (Einsätze)</figcaption>
        <svg viewBox={`0 0 ${W} 120`} role="img" aria-label="Rhythmische Einsätze beider Motive">
          {onsets(sa).map((t, i) => (
            <rect key={"a" + i} x={(t / maxDur) * W} y={14} width={3} height={36} fill={a.color} />
          ))}
          {onsets(sb).map((t, i) => (
            <rect key={"b" + i} x={(t / maxDur) * W} y={70} width={3} height={36} fill={b.color} />
          ))}
        </svg>
        <p className="muted cap">
          Jeder Strich = ein Ton- oder Schlageinsatz. {a.name}: {sa.meter}, {sa.bpm} BPM · {b.name}: {sb.meter}, {sb.bpm} BPM.
        </p>
      </figure>
    </div>
  );
}

export function ComparePage({ a: aId, b: bId }: { a?: string; b?: string }) {
  const a = CANTON_BY_ID[aId ?? ""] ?? CANTON_BY_ID.be;
  const b = CANTON_BY_ID[bId ?? ""] ?? CANTON_BY_ID.zh;
  const pb = usePlayback();
  useAccent(a.color);

  return (
    <div className="wrap section compare">
      <div className="section-head">
        <p className="eyebrow">Dialektvergleich</p>
        <h1 className="h2">
          <span style={{ color: a.color }}>{a.name}</span> <span className="vs">vs.</span> <span style={{ color: b.color }}>{b.name}</span>
        </h1>
        <p className="lead">Zwei Kantone nebeneinander: Farben, Wörter, Aufnahmen und Klangmotive. Spiele beide nacheinander ab und vergleiche.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn accent"
            onClick={() => (pb.playing ? audio.stop() : audio.playSequence([() => playCantonMusic(a), () => playCantonMusic(b)]))}
          >
            <Icon name={pb.playing ? "stop" : "play"} />
            {pb.playing ? "Stopp" : `Nacheinander abspielen: ${a.abbreviation} → ${b.abbreviation}`}
          </button>
          <button type="button" className="btn ghost" onClick={() => replaceRoute("vergleich", b.id, a.id)}>
            <Icon name="compare" /> Seiten tauschen
          </button>
        </div>
      </div>

      <div className="cmp-map">
        <SwissMap mode="art" interactive={false} autoFocus={false} selectedId={null} marked={[a.id, b.id]} ariaLabel={`Karte: ${a.name} und ${b.name} hervorgehoben`} />
      </div>

      <div className="cmp-grid">
        <Column c={a} side="a" onChange={(id) => replaceRoute("vergleich", id, b.id)} />
        <Column c={b} side="b" onChange={(id) => replaceRoute("vergleich", a.id, id)} />
      </div>

      <div className="section-head" style={{ marginTop: 64 }}>
        <p className="eyebrow">Gegenüberstellung</p>
        <h2 className="h3">Lautstärke, Tonhöhe und Rhythmus der beiden Motive</h2>
        <p className="muted" style={{ fontSize: 14 }}>
          Sobald echte Sprachaufnahmen vorhanden sind, lassen sie sich im Klanglabor auf dieselbe Weise analysieren.
        </p>
      </div>
      <CompareCharts a={a} b={b} />
    </div>
  );
}
