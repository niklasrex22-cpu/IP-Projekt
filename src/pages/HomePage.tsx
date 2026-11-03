import { SwissMap } from "../components/SwissMap";
import { Icon } from "../components/Icon";
import { Wappen } from "../components/Wappen";
import { MotifGlyph } from "../components/MotifGlyph";
import { CANTON_BY_ID, FEATURED_IDS } from "../data/cantons";
import { motifFor } from "../audio/motifFor";
import { href } from "../lib/router";

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <p className="eyebrow">Eine interaktive Reise durch Dialekte und Klänge</p>
            <h1 className="display">
              <span>Schweiz</span>
              <span>
                klingt <em>anders</em>
              </span>
            </h1>
            <p className="hero-sub">Entdecke die Schweiz durch Sprache, Musik und visuelle Kunst.</p>
            <p className="lead">
              «26 Kantone, unzählige Stimmen und ganz unterschiedliche Klänge. Entdecke, wie Sprache unsere Identität prägt und wie Dialekte durch Musik
              und Gestaltung sichtbar und hörbar werden.»
            </p>
            <div className="hero-cta">
              <a className="btn big accent" href={href("karte")}>
                Schweiz entdecken <Icon name="arrow" />
              </a>
              <a className="btn big ghost" href={href("klanglabor")}>
                Ins Klanglabor
              </a>
            </div>
          </div>
          <a className="hero-map" href={href("karte")} aria-label="Zur interaktiven Schweizerkarte">
            <SwissMap mode="art" interactive={false} ambient autoFocus={false} ariaLabel="Vorschau der künstlerischen Schweizerkarte" />
            <span className="hero-map-caption">26 Kantone · 4 Landessprachen · 1 Karte</span>
          </a>
        </div>
        <div className="hero-marquee" aria-hidden="true">
          <div>
            {["Grüezi", "Grüessech", "Allegra", "Bun di", "Bonjour", "Buongiorno", "Miuch", "Kind", "septante", "nonante", "azione", "Meitschi"].map((w, i) => (
              <span key={i}>{w}</span>
            ))}
            {["Grüezi", "Grüessech", "Allegra", "Bun di", "Bonjour", "Buongiorno", "Miuch", "Kind", "septante", "nonante", "azione", "Meitschi"].map((w, i) => (
              <span key={"b" + i}>{w}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Drei Wahrnehmungsebenen</p>
            <h2 className="h2">Sehen. Hören. Sprache erleben.</h2>
          </div>
          <div className="grid-3 triad">
            <article className="card pad">
              <span className="triad-n">01</span>
              <h3 className="h3">Was man sieht</h3>
              <p>Eine künstlerische Karte mit eigener Farbwelt, grafischen Strukturen und Wappen – Bildnerisches Gestalten macht Sprache sichtbar.</p>
            </article>
            <article className="card pad">
              <span className="triad-n">02</span>
              <h3 className="h3">Was man hört</h3>
              <p>Jeder Kanton hat ein eigenes Klangmotiv. Die Visualisierung reagiert auf echte Audiodaten – Musik wird zu Form und Farbe.</p>
            </article>
            <article className="card pad">
              <span className="triad-n">03</span>
              <h3 className="h3">Wie man Sprache erlebt</h3>
              <p>Wörter, Aufnahmen und ihre Klangwellen zeigen, wie unterschiedlich die Schweiz spricht – und dass Grenzen fliessend sind.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section featured">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Sechs Beispielkantone</p>
            <h2 className="h2">Vier Sprachen, sechs Klangwelten</h2>
            <p className="lead">Von Basel bis Bellinzona: Diese Kantone sind bereits ausführlich gestaltet. Die übrigen 20 folgen.</p>
          </div>
          <div className="featured-grid">
            {FEATURED_IDS.map((id) => {
              const c = CANTON_BY_ID[id];
              return (
                <a key={id} className="feature-card" href={href("karte", id)} style={{ ["--c" as string]: c.color }}>
                  <div className="feature-top">
                    <Wappen canton={c} size={36} />
                    <span className="abbr">{c.abbreviation}</span>
                  </div>
                  <h3>{c.name}</h3>
                  <p>{c.words[0]?.dialect !== "(Wort folgt)" ? `«${c.words[0].dialect}»` : ""}</p>
                  <MotifGlyph spec={motifFor(c)} color="#fff" height={50} title={`Klangsignet ${c.name}`} />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
