import { Wappen } from "../components/Wappen";
import { CANTONS } from "../data/cantons";
import { SOURCES } from "../data/sources";
import { href } from "../lib/router";

export function WappenPage() {
  const src = SOURCES["symbols-nzz"];
  return (
    <div className="wrap section">
      <div className="section-head">
        <p className="eyebrow">Wappensammlung</p>
        <h1 className="h2">26 Zeichen</h1>
        <p className="lead">
          Die Kantonswappen als grafische Sammlung – in BFS-Reihenfolge. Die Symbole sind pixelgenaue Vereinfachungen und zeigen, wie viel Gestaltung in
          wenigen Quadraten steckt.
        </p>
      </div>
      <ul className="wappen-grid">
        {CANTONS.map((c) => (
          <li key={c.id} style={{ ["--c" as string]: c.color }}>
            <a href={href("karte", c.id)}>
              <Wappen canton={c} size={96} />
              <span className="n">{String(c.bfs).padStart(2, "0")}</span>
              <strong>{c.name}</strong>
              <small>{c.abbreviation}</small>
            </a>
          </li>
        ))}
      </ul>
      <p className="muted" style={{ fontSize: 13, marginTop: 28 }}>
        Quelle: {src.author}, «{src.title}», <a href={src.url}>{src.url}</a>, Lizenz {src.license}. Die Zuordnung erfolgt über das ISO-3166-2-Kürzel des
        Kantons. {src.note}
      </p>
    </div>
  );
}
