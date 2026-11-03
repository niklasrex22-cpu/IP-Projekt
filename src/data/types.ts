/**
 * Datenmodell der Dialektbibliothek.
 * Siehe README.md → «Inhalte pflegen» für Anleitungen.
 */

export type LanguageCode = "de" | "fr" | "it" | "rm";

/**
 * Prüfstatus eines Inhalts – macht für Besucher:innen und Lehrpersonen transparent,
 * wie gesichert eine Angabe ist.
 *  - "amtlich":   amtliche Angabe (Verfassung, BFS, Kanton)
 *  - "literatur": in der genannten Fachliteratur dokumentiert; Seitenangabe vor der
 *                 Präsentation am Original nachprüfen
 *  - "eigen":     eigene Gestaltung/Komposition der Projektgruppe
 *  - "platzhalter": noch keine recherchierten Inhalte – muss ersetzt werden
 */
export type Verification = "amtlich" | "literatur" | "eigen" | "platzhalter";

export interface SourceReference {
  id: string;
  title: string;
  author?: string;
  year?: string;
  url?: string;
  license?: string;
  note?: string;
}

export interface DialectWord {
  /** Wort/Ausdruck in Dialekt oder Regionalsprache */
  dialect: string;
  /** Sprache des Ausdrucks (für korrektes lang-Attribut & Schriftbild) */
  lang: LanguageCode;
  /** Übersetzung ins Standarddeutsche */
  standardGerman: string;
  /** Kurze Erklärung */
  meaning?: string;
  /** Geltungsbereich – Kantonsgrenze ≠ Dialektgrenze! */
  scope?: string;
  audioUrl?: string;
  /** ID aus sources.ts */
  source?: string;
  verification: Verification;
}

export interface AudioExample {
  id: string;
  title: string;
  lang: LanguageCode;
  /** Transkription des Gesprochenen */
  transcript?: string;
  /** Übersetzung ins Standarddeutsche */
  translation?: string;
  /** Pfad unter public/, z. B. "assets/audio/dialects/be-beispiel.mp3" */
  audioUrl?: string;
  speaker?: string;
  recordedAt?: string;
  /** Einverständnis der sprechenden Person liegt vor */
  consent?: boolean;
  verification: Verification;
}

export interface MusicTrack {
  title: string;
  /** Eigene Aufnahme/Komposition (mp3/wav/ogg) unter public/assets/audio/music/ */
  audioUrl?: string;
  composer?: string;
  /** Wie wurde der Klang gestaltet? */
  description?: string;
}

export interface LanguageVariety {
  lang: LanguageCode;
  /** z. B. «Berndeutsch», «Français de Suisse romande», «Vallader» */
  label: string;
  note?: string;
}

export interface Canton {
  /** ISO-3166-2 ohne «CH-», klein geschrieben, z. B. "be" */
  id: string;
  /** BFS-Kantonsnummer (verknüpft Daten und Geometrie) */
  bfs: number;
  name: string;
  /** Offizielle Namen in den Amtssprachen des Kantons */
  officialNames: Partial<Record<LanguageCode, string>>;
  abbreviation: string;
  capital: string;
  /** Amtssprachen des Kantons */
  languages: LanguageCode[];
  /** Grobe Dialekt-/Sprachräume (überschreiten oft Kantonsgrenzen) */
  dialectRegions: string[];
  varieties: LanguageVariety[];
  /** Grossräumige geografische Einordnung */
  geography: string;
  description: string;
  linguisticNotes?: string[];
  /** Hauptfarbe (BG) */
  color: string;
  /** Pfad zum Wappen(symbol) */
  coatOfArms?: string;
  words: DialectWord[];
  audioExamples: AudioExample[];
  music?: MusicTrack;
  funFact?: { text: string; verification: Verification; source?: string };
  sources: string[];
  /** true = einer der sechs ausgearbeiteten Beispielkantone */
  featured?: boolean;
}

export const LANGUAGE_LABEL: Record<LanguageCode, string> = {
  de: "Deutsch",
  fr: "Französisch",
  it: "Italienisch",
  rm: "Rätoromanisch",
};

/** BCP-47-Tags für das lang-Attribut */
export const LANGUAGE_TAG: Record<LanguageCode, string> = {
  de: "gsw", // Schweizerdeutsch (Alemannisch)
  fr: "fr-CH",
  it: "it-CH",
  rm: "rm",
};
