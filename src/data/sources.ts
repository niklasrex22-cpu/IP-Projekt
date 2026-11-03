import type { SourceReference } from "./types";

/**
 * Zentrale Quellenliste. In den Kantonsdaten wird nur die `id` referenziert.
 * Neue Quelle hinzufügen: Objekt ergänzen und die id im Kanton bzw. Wort eintragen.
 */
export const SOURCES: Record<string, SourceReference> = {
  // ── Geodaten & Medien ──────────────────────────────────────────────
  "geo-bfs": {
    id: "geo-bfs",
    title: "Generalisierte Gemeindegrenzen der Schweiz (Kantonsgrenzen), Stand 1.1.2026",
    author: "Bundesamt für Statistik (BFS), ThemaKart; Basis swisstopo",
    url: "https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/administrative-grenzen/generalisierte-gemeindegrenzen.html",
    license: "Open Government Data – freie Nutzung, Quellenangabe Pflicht",
  },
  "geo-swissmaps": {
    id: "geo-swissmaps",
    title: "swiss-maps 4.7.0 – TopoJSON-Aufbereitung der BFS-Geodaten",
    author: "Interactive Things GmbH",
    url: "https://github.com/interactivethings/swiss-maps",
    license: "BSD-3-Clause",
  },
  "symbols-nzz": {
    id: "symbols-nzz",
    title: "ch-canton-symbols 1.3.2 – vereinfachte Symbole der Kantonswappen",
    author: "NZZ Storytelling (nzzdev)",
    url: "https://github.com/nzzdev/ch-canton-symbols",
    license: "CC BY-SA 4.0",
    note: "Pixelgenaue Vereinfachungen der Wappen; für die Schlusspräsentation optional durch die offiziellen Wappen der Staatskanzleien ersetzen.",
  },
  fonts: {
    id: "fonts",
    title: "Schriften «Fraunces» (Undercase Type) und «Inter» (Rasmus Andersson), via Fontsource",
    url: "https://fontsource.org",
    license: "SIL Open Font License 1.1",
  },

  // ── Amtliche Grundlagen ───────────────────────────────────────────
  "bv-art4": {
    id: "bv-art4",
    title: "Bundesverfassung der Schweizerischen Eidgenossenschaft, Art. 4 (Landessprachen) und Art. 70 (Sprachen)",
    url: "https://www.fedlex.admin.ch/eli/cc/1999/404/de",
    license: "Amtliche Veröffentlichung",
  },
  "bfs-sprachen": {
    id: "bfs-sprachen",
    title: "Sprachen – Hauptsprachen der ständigen Wohnbevölkerung (Strukturerhebung)",
    author: "Bundesamt für Statistik (BFS)",
    url: "https://www.bfs.admin.ch/bfs/de/home/statistiken/bevoelkerung/sprachen-religionen/sprachen.html",
  },
  "kv-gr": {
    id: "kv-gr",
    title: "Verfassung des Kantons Graubünden, Art. 3 (Landessprachen: Deutsch, Rätoromanisch, Italienisch)",
    url: "https://www.gr-lex.gr.ch",
  },
  "kv-be": {
    id: "kv-be",
    title: "Verfassung des Kantons Bern, Art. 6 (Landessprachen: Deutsch und Französisch)",
    url: "https://www.belex.sites.be.ch",
  },

  // ── Sprachwissenschaft ────────────────────────────────────────────
  "ksds": {
    id: "ksds",
    title: "Kleiner Sprachatlas der deutschen Schweiz (KSDS)",
    author: "Helen Christen, Elvira Glaser, Matthias Friedli (Hrsg.)",
    year: "2010 (und spätere Auflagen)",
    note: "Kartensammlung zu Laut- und Wortunterschieden, basiert auf dem SDS.",
  },
  sds: {
    id: "sds",
    title: "Sprachatlas der deutschen Schweiz (SDS), 8 Bände",
    author: "Rudolf Hotzenköcherle u. a.",
    year: "1962–2003",
  },
  idiotikon: {
    id: "idiotikon",
    title: "Schweizerisches Idiotikon – Wörterbuch der schweizerdeutschen Sprache",
    url: "https://www.idiotikon.ch",
    note: "Online frei durchsuchbar – ideal, um einzelne Wörter zu überprüfen.",
  },
  "dsr": {
    id: "dsr",
    title: "Dictionnaire suisse romand. Particularités lexicales du français contemporain",
    author: "André Thibault (Hrsg.)",
    year: "1997, 2. Aufl. 2004",
  },
  vsi: {
    id: "vsi",
    title: "Vocabolario dei dialetti della Svizzera italiana (VSI)",
    author: "Centro di dialettologia e di etnografia, Bellinzona",
    url: "https://www4.ti.ch/decs/dcsu/cde/",
  },
  olsi: {
    id: "olsi",
    title: "Osservatorio linguistico della Svizzera italiana (OLSI) – Publikationen zum italiano regionale svizzero und zu Helvetismen",
    url: "https://www4.ti.ch/decs/dcsu/olsi/",
  },
  "lia-rumantscha": {
    id: "lia-rumantscha",
    title: "Lia Rumantscha – Informationen zu den Idiomen und zum Rumantsch Grischun; Wörterbuch «Pledari Grond»",
    url: "https://www.liarumantscha.ch",
  },
  "drg": {
    id: "drg",
    title: "Dicziunari Rumantsch Grischun (DRG)",
    url: "https://www.drg.ch",
  },
  "ammon-vwb": {
    id: "ammon-vwb",
    title: "Variantenwörterbuch des Deutschen",
    author: "Ulrich Ammon u. a.",
    year: "2. Aufl. 2016",
    note: "Dokumentiert Helvetismen der Standardsprache.",
  },
  "eigen": {
    id: "eigen",
    title: "Eigene Gestaltung / Komposition der Projektgruppe",
    note: "Künstlerische Interpretation – keine authentische regionale Musik.",
  },
};

export function getSource(id?: string): SourceReference | undefined {
  return id ? SOURCES[id] : undefined;
}
