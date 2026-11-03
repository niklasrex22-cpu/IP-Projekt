import { SOURCES } from "../data/sources";
import { GEO_META } from "../data/geo";
import { href } from "../lib/router";

const MISSING = [
  "Eigene Sprachaufnahmen für alle sechs Beispielkantone (mit schriftlichem Einverständnis der Sprecher:innen).",
  "Eigene Kompositionen/Aufnahmen der Musikgruppe als Ersatz für die Demo-Motive (v. a. für die 20 Platzhalter-Kantone).",
  "Überprüfung aller als «Literatur – prüfen» markierten Angaben am Original (Seite/Karte im KSDS, Stichwort im Idiotikon, DSR, VSI, Pledari Grond).",
  "Recherchierte Wörter für die 20 noch nicht ausgearbeiteten Kantone.",
  "Eigene Illustrationen der BG-Gruppe (Ordner public/assets/images/illustrations/).",
  "Optional: offizielle Kantonswappen (z. B. von den Staatskanzleien) statt der vereinfachten Symbole.",
  "Hörfragen mit echten Aufnahmen im Quiz (src/data/quiz.ts, Typ «recording»).",
];

export function AboutPage() {
  return (
    <div className="about">
      <section className="wrap section">
        <div className="section-head">
          <p className="eyebrow">Über das Projekt</p>
          <h1 className="display" style={{ fontSize: "clamp(44px, 8vw, 120px)" }}>
            Wie kann Sprache durch Musik und Gestaltung erlebbar werden?
          </h1>
        </div>
        <p className="lead">
          «Schweiz klingt anders» ist ein interdisziplinäres Projekt der Fächer Bildnerisches Gestalten und Musik. Die interaktive Karte verbindet drei
          Wahrnehmungsebenen: was man <em>sieht</em>, was man <em>hört</em> und wie man <em>Sprache erlebt</em>.
        </p>
      </section>

      <section className="wrap">
        <div className="venn" aria-label="Verbindung von Bildnerischem Gestalten und Musik">
          <div className="venn-c bg">
            <h2 className="h3">Bildnerisches Gestalten</h2>
            <ul>
              <li>Farbkonzept mit Sprachfarb-Familien und individuellen Kantonsnuancen</li>
              <li>Künstlerische Karte mit grafischen Strukturen (Linien, Punkte, Wellen, Raster, Ringe)</li>
              <li>Typografie: Fraunces (Display) × Inter (Text)</li>
              <li>Kantonswappen als grafische Sammlung</li>
              <li>Illustrationen & Animationen</li>
            </ul>
          </div>
          <div className="venn-mid">
            <h2 className="h3">Gemeinsam</h2>
            <ul>
              <li>Audio wird in visuelle Formen übersetzt (Wellenform, Rhythmusbild)</li>
              <li>Klangsignet = grafische Partitur aus den Noten</li>
              <li>Jedes Motiv knüpft an ein Sprachphänomen an</li>
              <li>Musikereignisse lassen die Karte reagieren</li>
            </ul>
          </div>
          <div className="venn-c mu">
            <h2 className="h3">Musik</h2>
            <ul>
              <li>Klangmotive komponieren (Notation im Code bearbeitbar)</li>
              <li>Rhythmen & Taktarten ausprobieren (3/4, 6/8, 7/8 + 9/8 …)</li>
              <li>Eigene Audiobeispiele aufnehmen und bearbeiten</li>
              <li>Dialektaufnahmen akustisch untersuchen (Klanglabor)</li>
              <li>Klang und Bild bewusst verbinden</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <p className="eyebrow">Gestalterische Entscheidungen</p>
          <h2 className="h2">Warum es so aussieht – und so klingt</h2>
        </div>
        <div className="grid-2">
          <article className="card pad decision">
            <h3 className="h3">Farbe ≠ Identität</h3>
            <p>
              Jede Amtssprache hat eine Farbfamilie (Deutsch: Ocker/Terrakotta, Französisch: Blau, Italienisch: Grün, Rätoromanisch: Rosé). Innerhalb
              einer Familie bekommt jeder Kanton eine eigene Nuance – damit nicht der Eindruck entsteht, alle Kantone einer Sprachregion seien gleich.
              Mehrsprachige Kantone tragen Streifen aller Sprachfarben; die Streifen sind bewusst keine geografische Aussage darüber, wo welche Sprache
              gesprochen wird.
            </p>
          </article>
          <article className="card pad decision">
            <h3 className="h3">Echte Grenzen, ehrliche Inhalte</h3>
            <p>
              Die Kantonsformen stammen aus den generalisierten Grenzen des Bundesamts für Statistik (Stand {GEO_META.year}) und wurden nur projiziert,
              nie von Hand gezeichnet. Alle Inhalte tragen einen Prüfstatus: <em>Amtlich</em>, <em>Literatur – prüfen</em>, <em>Eigene Gestaltung</em>{" "}
              oder <em>Platzhalter</em>.
            </p>
          </article>
          <article className="card pad decision">
            <h3 className="h3">Demo-Klänge sind Interpretationen</h3>
            <p>
              Die Klangmotive werden live im Browser mit der Web Audio API erzeugt. Sie sind künstlerische Interpretationen der Projektgruppe und
              ausdrücklich <strong>keine</strong> traditionelle oder authentische Musik der Kantone. Die Musikgruppe ersetzt sie durch eigene
              Kompositionen.
            </p>
          </article>
          <article className="card pad decision">
            <h3 className="h3">Visualisierung aus echten Daten</h3>
            <p>
              Die Wellenform und das Rhythmusbild entstehen aus den tatsächlichen Audiodaten (AnalyserNode) und aus den tatsächlich gespielten Noten. Es
              gibt keine Zufallsanimation, die nur so tut, als ob. Die Sprachanalyse beschreibt nur die jeweilige Aufnahme – es werden keine «typischen»
              Eigenschaften von Kantonen behauptet.
            </p>
          </article>
        </div>
      </section>

      <section className="wrap section" id="quellen">
        <div className="section-head">
          <p className="eyebrow">Quellen & Lizenzen</p>
          <h2 className="h2">Woher die Inhalte stammen</h2>
        </div>
        <ol className="source-list about-sources">
          {Object.values(SOURCES).map((s) => (
            <li key={s.id}>
              <strong>{s.title}</strong>
              {s.author && <> – {s.author}</>}
              {s.year && <> ({s.year})</>}
              {s.license && <span className="chip" style={{ marginLeft: 8 }}>{s.license}</span>}
              {s.url && (
                <>
                  <br />
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.url}
                  </a>
                </>
              )}
              {s.note && <div className="muted">{s.note}</div>}
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <p className="eyebrow">Noch offen</p>
          <h2 className="h2">Was für die Schlusspräsentation fehlt</h2>
        </div>
        <ul className="todo-list">
          {MISSING.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p style={{ marginTop: 24 }}>
          <a className="btn" href={href("karte")}>
            Zur Karte
          </a>
        </p>
      </section>
    </div>
  );
}
