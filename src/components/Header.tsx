import { useEffect, useState } from "react";
import { audio, usePlayback } from "../audio/engine";
import { href, type PageKey } from "../lib/router";
import { Icon } from "./Icon";

const NAV: { page: PageKey; label: string }[] = [
  { page: "start", label: "Start" },
  { page: "karte", label: "Schweizerkarte" },
  { page: "klanglabor", label: "Klanglabor" },
  { page: "vergleich", label: "Dialektvergleich" },
  { page: "quiz", label: "Dialektquiz" },
  { page: "projekt", label: "Über das Projekt" },
];

export function Header({ page }: { page: PageKey }) {
  const [open, setOpen] = useState(false);
  const pb = usePlayback();
  useEffect(() => setOpen(false), [page]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const current = page === "wappen" ? "karte" : page;

  return (
    <header className="site-header">
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>
        Zum Inhalt springen
      </a>
      <div className="wrap">
        <a className="brand" href={href("start")} aria-label="Schweiz klingt anders – Startseite">
          <span className="brand-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 32 32">
              <path d="M3 16c2-6 4-6 6 0s4 6 6 0 4-6 6 0 4 6 6 0" fill="none" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          <span>
            Schweiz klingt anders
            <small>BG × Musik</small>
          </span>
        </a>

        <nav id="hauptnavigation" className={`nav ${open ? "open" : ""}`} aria-label="Hauptnavigation">
          {NAV.map((n) => (
            <a key={n.page} href={href(n.page)} aria-current={current === n.page ? "page" : undefined}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="header-tools">
          {pb.playing && (
            <button type="button" className="icon-btn" onClick={() => audio.stop()} aria-label={`Wiedergabe stoppen: ${pb.title}`} title={`Stopp: ${pb.title}`}>
              <span className="eq" aria-hidden="true"><i /><i /><i /></span>
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            aria-pressed={pb.muted}
            onClick={() => audio.setMuted(!pb.muted)}
            aria-label={pb.muted ? "Ton einschalten" : "Ton ausschalten"}
            title={pb.muted ? "Ton einschalten" : "Ton ausschalten"}
          >
            <Icon name={pb.muted ? "mute" : "sound"} />
          </button>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="hauptnavigation"
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
