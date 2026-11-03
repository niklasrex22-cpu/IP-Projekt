import { href } from "../lib/router";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <strong style={{ color: "var(--ink)" }}>Schweiz klingt anders</strong> – interdisziplinäres Schulprojekt Bildnerisches Gestalten & Musik.
          <br />
          Kartengrundlage: BFS/swisstopo (via swiss-maps, BSD-3-Clause) · Wappensymbole: NZZ ch-canton-symbols (CC BY-SA 4.0).
        </div>
        <div>
          <a href={href("projekt")}>Quellen & Lizenzen</a> · Demo-Klänge sind künstlerische Interpretationen.
        </div>
      </div>
    </footer>
  );
}
