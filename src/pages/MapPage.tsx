import { useEffect, useRef, useState } from "react";
import { CantonDetail } from "../components/CantonDetail";
import { Icon } from "../components/Icon";
import { SwissMap, type MapMode, type SwissMapHandle } from "../components/SwissMap";
import { Wappen } from "../components/Wappen";
import { CANTONS, CANTON_BY_ID } from "../data/cantons";
import { LANGUAGE_LABEL, type LanguageCode } from "../data/types";
import { useAccent } from "../lib/hooks";
import { href, navigate, replaceRoute } from "../lib/router";
import { audio } from "../audio/engine";
import { playCantonMusic } from "../components/MotifPlayer";

const MODES: { id: MapMode; label: string }[] = [
  { id: "art", label: "Künstlerisch" },
  { id: "geo", label: "Geografisch" },
  { id: "wappen", label: "Wappen" },
];

function loadMode(): MapMode {
  try {
    const m = localStorage.getItem("ska-map-mode");
    if (m === "art" || m === "geo" || m === "wappen") return m;
  } catch {
    /* privater Modus */
  }
  return "art";
}

export function MapPage({ cantonId }: { cantonId?: string }) {
  const canton = cantonId ? CANTON_BY_ID[cantonId] : undefined;
  const [mode, setMode] = useState<MapMode>(loadMode);
  const mapRef = useRef<SwissMapHandle>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevId = useRef<string | undefined>(undefined);
  const mounted = useRef(false);
  useAccent(canton?.color ?? "#e8553a");

  useEffect(() => {
    try {
      localStorage.setItem("ska-map-mode", mode);
    } catch {
      /* ignorieren */
    }
  }, [mode]);

  // Kantonswechsel: Klangwelt wechselt sanft (laufende Musik eines anderen Kantons stoppen)
  useEffect(() => {
    // Lief gerade das Motiv des vorherigen Kantons, übernimmt das neue Motiv (Klangwelt wechselt mit).
    if (prevId.current && prevId.current !== cantonId && audio.state.playing && audio.state.cantonId && audio.state.cantonId !== cantonId) {
      const next = cantonId ? CANTON_BY_ID[cantonId] : undefined;
      if (next && audio.state.sourceId?.startsWith("motif:")) playCantonMusic(next);
      else audio.stop();
    }
    prevId.current = cantonId;
    if (!mounted.current) {
      mounted.current = true; // beim ersten Laden nicht scrollen
      return;
    }
    if (cantonId && panelRef.current && window.matchMedia("(max-width: 980px)").matches) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [cantonId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cantonId) replaceRoute("karte");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cantonId]);

  const select = (id: string) => {
    if (id === cantonId) return;
    if (cantonId) replaceRoute("karte", id);
    else navigate("karte", id);
  };

  const groups: LanguageCode[] = ["de", "fr", "it", "rm"];

  return (
    <div className="map-page">
      <div className="map-stage">
        <div className="map-toolbar">
          <div className="segmented" role="group" aria-label="Kartenstil">
            {MODES.map((m) => (
              <button key={m.id} type="button" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" className="icon-btn" onClick={() => mapRef.current?.zoomBy(1.5)} aria-label="Hineinzoomen" title="Hineinzoomen (+)">
              <Icon name="plus" />
            </button>
            <button type="button" className="icon-btn" onClick={() => mapRef.current?.zoomBy(1 / 1.5)} aria-label="Herauszoomen" title="Herauszoomen (−)">
              <Icon name="minus" />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => {
                if (cantonId) replaceRoute("karte");
                mapRef.current?.reset();
              }}
              aria-label="Kartenansicht zurücksetzen"
              title="Ansicht zurücksetzen (0)"
            >
              <Icon name="reset" />
            </button>
          </div>
        </div>

        <SwissMap handleRef={mapRef} mode={mode} selectedId={cantonId ?? null} onSelect={select} />

        <div className="map-legend">
          {mode === "art" && (
            <>
              {groups.map((l) => (
                <span key={l} className="legend-item">
                  <i style={{ background: `var(--lang-${l})` }} /> {LANGUAGE_LABEL[l]}
                </span>
              ))}
              <span className="legend-item">
                <i className="striped" /> mehrsprachig
              </span>
            </>
          )}
          {mode === "geo" && <span className="legend-item">Generalisierte Kantonsgrenzen · Stand 1.1.2026 · Quelle: BFS/swisstopo</span>}
          {mode === "wappen" && (
            <a className="btn sm ghost" href={href("wappen")}>
              Wappensammlung ansehen <Icon name="arrow" size={14} />
            </a>
          )}
          <span className="legend-hint">Ziehen = verschieben · Mausrad/Pinch = zoomen · Tab = Kantone</span>
        </div>
        <p className="map-note">
          Farben zeigen die Amtssprache(n) eines Kantons – nicht seine Dialekte. Jeder Kanton hat eine eigene Nuance, denn auch Kantone derselben
          Sprachregion sprechen nicht gleich.
        </p>
      </div>

      <aside className="map-panel" ref={panelRef} aria-live="polite">
        {canton ? (
          <CantonDetail canton={canton} onClose={() => replaceRoute("karte")} />
        ) : (
          <div className="panel-intro">
            <p className="eyebrow">Schweizerkarte</p>
            <h1 className="h2">Wähle einen Kanton</h1>
            <p className="lead" style={{ fontSize: 17 }}>
              Klicke auf die Karte oder wähle aus der Liste. Jeder Kanton öffnet eine eigene Ausstellung mit Wörtern, Aufnahmen und einem Klangmotiv.
            </p>
            {groups.map((l) => {
              const list = CANTONS.filter((c) => c.languages[0] === l || (l === "rm" && c.languages.includes("rm")));
              if (!list.length) return null;
              return (
                <div key={l} className="canton-group">
                  <h2 className="eyebrow" style={{ color: `var(--lang-${l})` }}>
                    {l === "rm" ? "Mit Rätoromanisch" : LANGUAGE_LABEL[l]}
                  </h2>
                  <ul className="canton-list">
                    {list.map((c) => (
                      <li key={c.id + l}>
                        <button type="button" onClick={() => select(c.id)} style={{ ["--c" as string]: c.color }}>
                          <Wappen canton={c} size={22} />
                          <span>{c.name}</span>
                          <small title={c.languages.length > 1 ? `${c.languages.length} Amtssprachen` : undefined}>{c.abbreviation}</small>
                          {c.featured && <span className="star" title="ausgearbeiteter Beispielkanton">●</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <p className="muted" style={{ fontSize: 13, marginTop: 16 }}>● = ausführlich gestalteter Beispielkanton</p>
          </div>
        )}
      </aside>
    </div>
  );
}
