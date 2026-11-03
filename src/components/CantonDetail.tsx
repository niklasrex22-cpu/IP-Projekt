import { useEffect, useState } from "react";
import { audio, usePlayback } from "../audio/engine";
import { analyzeBuffer, type AudioAnalysis } from "../audio/analysis";
import { getSource } from "../data/sources";
import { LANGUAGE_LABEL, LANGUAGE_TAG, type AudioExample, type Canton, type DialectWord } from "../data/types";
import { assetUrl } from "../lib/hooks";
import { href } from "../lib/router";
import { useProgress } from "../lib/useProgress";
import { AnalysisView } from "./AnalysisView";
import { Badge } from "./Badge";
import { Icon } from "./Icon";
import { LangChips } from "./LangChips";
import { MotifGlyph } from "./MotifGlyph";
import { MotifPlayer } from "./MotifPlayer";
import { PlayButton } from "./PlayButton";
import { Wappen } from "./Wappen";
import { motifFor } from "../audio/motifFor";

/** Lädt und analysiert eine Audiodatei (für Klangwelle & Pausen). */
export function useFileAnalysis(url?: string) {
  const [a, setA] = useState<AudioAnalysis | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    setA(null);
    setErr(null);
    if (!url) return;
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(assetUrl(url));
        if (!res.ok) throw new Error(`Datei nicht gefunden (${res.status})`);
        const data = await res.arrayBuffer();
        const Ctx = window.OfflineAudioContext;
        const ctx = new Ctx(1, 1, 44100);
        const buf = await ctx.decodeAudioData(data);
        if (!cancel) setA(analyzeBuffer(buf));
      } catch (e) {
        if (!cancel) setErr(`«${url}»: ${(e as Error).message}. Liegt die Datei in public/${url}?`);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [url]);
  return { analysis: a, error: err };
}

export function SourceNote({ id }: { id?: string }) {
  const s = getSource(id);
  if (!s) return null;
  return (
    <span title={s.title}>
      Quelle: {s.url ? <a href={s.url} target="_blank" rel="noreferrer">{shortTitle(s.title)}</a> : shortTitle(s.title)}
    </span>
  );
}

function shortTitle(t: string) {
  return t.length > 60 ? t.slice(0, 58) + "…" : t;
}

export function WordCard({ w, canton }: { w: DialectWord; canton: Canton }) {
  const sid = `word:${canton.id}:${w.dialect}`;
  const ph = w.verification === "platzhalter";
  return (
    <article className={`word ${ph ? "is-placeholder" : ""}`}>
      <div>
        <div className="w" lang={LANGUAGE_TAG[w.lang]}>
          {w.dialect}
        </div>
        <div className="t">= {w.standardGerman}</div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
        {w.audioUrl ? (
          <PlayButton sourceId={sid} size="sm" variant="ghost" label="Anhören" onPlay={() => void audio.playFile(sid, assetUrl(w.audioUrl!), canton.id, w.dialect)} />
        ) : (
          <span className="chip" title="Für dieses Wort gibt es noch keine Aufnahme">
            <Icon name="mute" size={14} /> keine Aufnahme
          </span>
        )}
      </div>
      {w.meaning && <p className="m">{w.meaning}</p>}
      <div className="meta">
        <Badge v={w.verification} />
        <span>{LANGUAGE_LABEL[w.lang]}</span>
        {w.scope && <span>· Verbreitung: {w.scope}</span>}
        {w.source && (
          <span>
            · <SourceNote id={w.source} />
          </span>
        )}
      </div>
    </article>
  );
}

export function RecordingItem({ r, canton }: { r: AudioExample; canton: Canton }) {
  const sid = `rec:${canton.id}:${r.id}`;
  const { analysis, error } = useFileAnalysis(r.audioUrl);
  const { progress } = useProgress(sid);
  if (!r.audioUrl) {
    return (
      <div className="placeholder-box">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <strong>{r.title}</strong>
          <Badge v="platzhalter" />
        </div>
        <p style={{ marginTop: 6 }}>
          Noch keine Aufnahme vorhanden ({LANGUAGE_LABEL[r.lang]}). Datei unter <code>public/assets/audio/dialects/</code> ablegen und in{" "}
          <code>src/data/cantons.ts</code> bei <code>audioExamples</code> eintragen. Bis dahin kannst du im{" "}
          <a href={href("klanglabor")}>Klanglabor</a> eine eigene Aufnahme testen.
        </p>
      </div>
    );
  }
  return (
    <div className="card pad" style={{ display: "grid", gap: 12 }}>
      <div className="recording">
        <div>
          <strong>{r.title}</strong>
          <div className="muted" style={{ fontSize: 13 }}>
            {LANGUAGE_LABEL[r.lang]}
            {r.speaker && ` · ${r.speaker}`}
            {r.recordedAt && ` · ${r.recordedAt}`}
          </div>
        </div>
        <PlayButton sourceId={sid} label="Aufnahme anhören" variant="ghost" onPlay={() => void audio.playFile(sid, assetUrl(r.audioUrl!), canton.id, r.title)} />
      </div>
      {error && <div className="error-msg">{error}</div>}
      {analysis && <AnalysisView a={analysis} color={canton.color} progress={progress} />}
      {r.transcript && (
        <p lang={LANGUAGE_TAG[r.lang]} style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>
          «{r.transcript}»
        </p>
      )}
      {r.translation && <p className="muted">Übersetzung: {r.translation}</p>}
      <Badge v={r.verification} />
    </div>
  );
}

export function CantonDetail({ canton, onClose }: { canton: Canton; onClose?: () => void }) {
  const pb = usePlayback();
  const spec = motifFor(canton);
  const multi = canton.languages.length > 1;

  return (
    <article className="detail" key={canton.id} style={{ ["--c" as string]: canton.color }} aria-labelledby={`detail-${canton.id}`}>
      {/* 1 · Überblick */}
      <header className="detail-hero">
        <div className="top">
          <div>
            <div className="abbr">KANTON · {canton.abbreviation}</div>
            <h2 id={`detail-${canton.id}`}>{canton.name}</h2>
            {Object.entries(canton.officialNames).filter(([, n]) => n !== canton.name).length > 0 && (
              <div style={{ opacity: 0.85, marginTop: 6 }}>
                {Object.entries(canton.officialNames).map(([l, n]) => (
                  <span key={l} lang={l} style={{ marginRight: 12 }}>
                    {n}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Wappen canton={canton} size={64} />
            {onClose && (
              <button type="button" className="icon-btn close" onClick={onClose} aria-label="Detailansicht schliessen">
                <Icon name="close" />
              </button>
            )}
          </div>
        </div>
        <dl className="facts">
          <div>
            <dt>Hauptort</dt>
            <dd>{canton.capital}</dd>
          </div>
          <div>
            <dt>Amtssprache{multi ? "n" : ""}</dt>
            <dd>{canton.languages.map((l) => LANGUAGE_LABEL[l]).join(", ")}</dd>
          </div>
          <div>
            <dt>Lage</dt>
            <dd>{canton.geography}</dd>
          </div>
        </dl>
        <div className="glyph" aria-hidden="true">
          <MotifGlyph spec={spec} color="#ffffff" height={60} title="Klangsignet" />
        </div>
      </header>

      <p className="lead" style={{ fontSize: 17 }}>
        {canton.description}
      </p>

      {/* 2 · Sprache */}
      <section aria-labelledby={`lang-${canton.id}`}>
        <h3 id={`lang-${canton.id}`}>
          <span className="num">01</span> Sprache & Dialekte
        </h3>
        <div style={{ display: "grid", gap: 12 }}>
          <LangChips langs={canton.languages} />
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            {canton.varieties.map((v, i) => (
              <li key={i}>
                <strong>{v.label}</strong>
                {v.note && <span className="muted"> — {v.note}</span>}
              </li>
            ))}
          </ul>
          {canton.dialectRegions.length > 0 && (
            <dl className="kv">
              <dt>Sprachräume</dt>
              <dd>{canton.dialectRegions.join(" · ")}</dd>
            </dl>
          )}
          {canton.linguisticNotes && (
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6, fontSize: 15 }}>
              {canton.linguisticNotes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
          <div className="notice">
            <span aria-hidden="true">ⓘ</span>
            <span>
              Kantonsgrenzen sind keine Dialektgrenzen. Innerhalb eines Kantons kommen oft mehrere Mundarten vor, und viele Merkmale reichen über die
              Grenze hinaus.
            </span>
          </div>
        </div>
      </section>

      {/* 3 · Wörter */}
      <section aria-labelledby={`words-${canton.id}`}>
        <h3 id={`words-${canton.id}`}>
          <span className="num">02</span> Wörter & Redewendungen
        </h3>
        <div className="words">
          {canton.words.map((w, i) => (
            <WordCard key={i} w={w} canton={canton} />
          ))}
        </div>
        {canton.funFact && (
          <div className="card pad" style={{ marginTop: 14, background: "color-mix(in srgb, var(--c) 8%, var(--card))" }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              Gut zu wissen
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 19, lineHeight: 1.35 }}>{canton.funFact.text}</p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, fontSize: 12, flexWrap: "wrap" }} className="muted">
              <Badge v={canton.funFact.verification} />
              <SourceNote id={canton.funFact.source} />
            </div>
          </div>
        )}
      </section>

      {/* 4 · Aufnahmen */}
      <section aria-labelledby={`rec-${canton.id}`}>
        <h3 id={`rec-${canton.id}`}>
          <span className="num">03</span> Sprachaufnahmen
        </h3>
        <div style={{ display: "grid", gap: 10 }}>
          {canton.audioExamples.map((r) => (
            <RecordingItem key={r.id} r={r} canton={canton} />
          ))}
        </div>
      </section>

      {/* 5 · Musik */}
      <section aria-labelledby={`music-${canton.id}`}>
        <h3 id={`music-${canton.id}`}>
          <span className="num">04</span> Klangmotiv
        </h3>
        <MotifPlayer canton={canton} />
        {pb.error && (
          <div className="error-msg" role="alert" style={{ marginTop: 10 }}>
            {pb.error}{" "}
            <button type="button" className="btn sm ghost" onClick={() => audio.clearError()}>
              OK
            </button>
          </div>
        )}
      </section>

      {/* 6 · Gestaltung */}
      <section aria-labelledby={`art-${canton.id}`}>
        <h3 id={`art-${canton.id}`}>
          <span className="num">05</span> Visuelle Gestaltung
        </h3>
        <div className="grid-2" style={{ gap: 12 }}>
          <div className="card pad" style={{ display: "grid", gap: 10 }}>
            <div className="eyebrow">Farbe</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[100, 70, 45, 22].map((p) => (
                <span key={p} style={{ flex: 1, height: 54, borderRadius: 10, background: `color-mix(in srgb, ${canton.color} ${p}%, var(--paper))` }} />
              ))}
            </div>
            <p style={{ fontSize: 13 }} className="muted">
              Hauptfarbe <code>{canton.color}</code> – eine eigene Nuance innerhalb der Farbfamilie der Amtssprache
              {multi ? "n. Mehrsprachige Kantone tragen in der künstlerischen Karte Streifen aller Sprachfarben" : ""}.
            </p>
          </div>
          <div className="card pad" style={{ display: "grid", gap: 10 }}>
            <div className="eyebrow">Klangsignet</div>
            <MotifGlyph spec={spec} color={canton.color} height={80} />
            <p style={{ fontSize: 13 }} className="muted">
              Grafische Partitur, direkt aus den Noten des Motivs berechnet: waagrecht die Zeit, senkrecht die Tonhöhe.
            </p>
          </div>
        </div>
      </section>

      {/* 7 · Quellen */}
      <section aria-labelledby={`src-${canton.id}`}>
        <h3 id={`src-${canton.id}`}>
          <span className="num">06</span> Quellen
        </h3>
        <ol className="source-list">
          {canton.sources.map((id) => {
            const s = getSource(id);
            if (!s) return null;
            return (
              <li key={id}>
                {s.author && <>{s.author}: </>}
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                  </a>
                ) : (
                  s.title
                )}
                {s.year && <> ({s.year})</>}
              </li>
            );
          })}
        </ol>
        <p style={{ marginTop: 14 }}>
          <a className="btn ghost sm" href={href("vergleich", canton.id, canton.id === "zh" ? "be" : "zh")}>
            <Icon name="compare" size={16} /> Mit anderem Kanton vergleichen
          </a>
        </p>
      </section>
    </article>
  );
}
