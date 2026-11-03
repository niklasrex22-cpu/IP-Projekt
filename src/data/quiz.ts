import type { Verification } from "./types";

/**
 * Dialektquiz.
 *
 * Fragetypen:
 *  - "recording": authentische Sprachaufnahme anhören (audioUrl Pflicht!).
 *      Fragen ohne vorhandene Datei werden automatisch ausgeblendet.
 *  - "motif":     ein Demo-Klangmotiv anhören (künstlerische Interpretation, KEINE echte Regionalmusik)
 *  - "text":      Wissensfrage zu belegten Inhalten der Dialektbibliothek
 *
 * Neue Frage: Objekt unten ergänzen. `answer` ist der Index in `options` (0–3).
 */

export interface QuizQuestion {
  id: string;
  type: "recording" | "motif" | "text";
  prompt: string;
  /** Für "recording": Pfad zur Aufnahme unter public/ */
  audioUrl?: string;
  /** Für "motif": Kantons-ID, deren Demo-Motiv abgespielt wird */
  motifCanton?: string;
  options: string[];
  answer: number;
  explanation: string;
  /** Kanton, der nach der Antwort auf der Mini-Karte markiert wird */
  revealCanton?: string;
  source?: string;
  verification: Verification;
  /** true = ausdrücklich als Demo-/Testfrage markiert */
  demo: boolean;
}

export const QUIZ: QuizQuestion[] = [
  // ── Beispiel für eine Frage mit echter Aufnahme (wird angezeigt, sobald die Datei existiert)
  {
    id: "rec-be-1",
    type: "recording",
    prompt: "Aus welchem Kanton stammt diese Sprachaufnahme?",
    audioUrl: undefined, // z. B. "assets/audio/dialects/be-gruessech.mp3"
    options: ["Bern", "Zürich", "Basel-Stadt", "Graubünden"],
    answer: 0,
    explanation: "Platzhalter – hier die Erklärung mit Bezug auf die Aufnahme eintragen.",
    revealCanton: "be",
    verification: "platzhalter",
    demo: false,
  },
  {
    id: "txt-miuch",
    type: "text",
    prompt: "«Miuch» statt «Milch»: In welchem Kanton ist diese Aussprache besonders verbreitet?",
    options: ["Bern", "Basel-Stadt", "Zürich", "Tessin"],
    answer: 0,
    explanation:
      "Die sogenannte L-Vokalisierung (l → u) ist typisch für grosse Teile des Kantons Bern und angrenzende Gebiete. Achtung: Sie endet nicht exakt an der Kantonsgrenze.",
    revealCanton: "be",
    source: "ksds",
    verification: "literatur",
    demo: true,
  },
  {
    id: "txt-kind",
    type: "text",
    prompt: "Wo sagt man «Kind» statt «Chind»?",
    options: ["Zürich", "Bern", "Basel-Stadt", "Graubünden"],
    answer: 2,
    explanation:
      "Das Baseldeutsche bewahrt das «k» am Wortanfang. Damit gehört es zum Niederalemannischen – die meisten anderen Deutschschweizer Mundarten haben hier ein «ch».",
    revealCanton: "bs",
    source: "ksds",
    verification: "literatur",
    demo: true,
  },
  {
    id: "txt-gr",
    type: "text",
    prompt: "Welcher Kanton hat drei Amtssprachen?",
    options: ["Freiburg", "Wallis", "Graubünden", "Bern"],
    answer: 2,
    explanation:
      "Graubünden ist der einzige dreisprachige Kanton: Deutsch, Rätoromanisch und Italienisch. Freiburg, Wallis und Bern sind zweisprachig (Deutsch/Französisch).",
    revealCanton: "gr",
    source: "kv-gr",
    verification: "amtlich",
    demo: true,
  },
  {
    id: "txt-allegra",
    type: "text",
    prompt: "«Allegra!» ist ein Gruss in welcher Sprache?",
    options: ["Italienisch", "Rätoromanisch", "Französisch", "Walserdeutsch"],
    answer: 1,
    explanation: "«Allegra» ist ein rätoromanischer Gruss, besonders im Engadin – wörtlich etwa «Freue dich!».",
    revealCanton: "gr",
    source: "lia-rumantscha",
    verification: "literatur",
    demo: true,
  },
  {
    id: "txt-septante",
    type: "text",
    prompt: "Was bedeutet «nonante»?",
    options: ["neun", "neunzehn", "neunzig", "neunhundert"],
    answer: 2,
    explanation: "In der Romandie (z. B. Genf) heisst neunzig «nonante». In Frankreich sagt man «quatre-vingt-dix».",
    revealCanton: "ge",
    source: "dsr",
    verification: "literatur",
    demo: true,
  },
  {
    id: "txt-huitante",
    type: "text",
    prompt: "Achtzig auf Französisch: In welchem Kanton sagt man eher «quatre-vingts» als «huitante»?",
    options: ["Waadt", "Wallis", "Freiburg", "Genf"],
    answer: 3,
    explanation:
      "«Huitante» ist v. a. in der Waadt, im Wallis und in Freiburg verbreitet. In Genf (und Neuenburg) sagt man meist «quatre-vingts». Selbst innerhalb einer Sprachregion gibt es also Unterschiede!",
    revealCanton: "ge",
    source: "dsr",
    verification: "literatur",
    demo: true,
  },
  {
    id: "txt-azione",
    type: "text",
    prompt: "Im Tessiner Supermarkt steht «azione». Was ist gemeint?",
    options: ["Ausgang", "Sonderangebot", "Kasse", "Neuheit"],
    answer: 1,
    explanation: "«Azione» bedeutet im Schweizer Italienisch «Sonderangebot» – nach dem Vorbild des deutschen Worts «Aktion». In Italien sagt man «offerta».",
    revealCanton: "ti",
    source: "olsi",
    verification: "literatur",
    demo: true,
  },
  {
    id: "motif-gr",
    type: "motif",
    prompt: "Klangrätsel: Zu welchem Kanton gehört dieses Demo-Motiv der Projektgruppe? (Tipp: Hör auf die Anzahl Stimmen.)",
    motifCanton: "gr",
    options: ["Genf", "Graubünden", "Zürich", "Basel-Stadt"],
    answer: 1,
    explanation:
      "Drei Stimmen setzen nacheinander als Kanon ein – je eine Klangfarbe für die drei Amtssprachen Graubündens. Das Motiv ist eine künstlerische Interpretation, keine traditionelle Musik.",
    revealCanton: "gr",
    source: "eigen",
    verification: "eigen",
    demo: true,
  },
  {
    id: "motif-ge",
    type: "motif",
    prompt: "Klangrätsel: Dieses Demo-Motiv spielt mit 7er- und 9er-Gruppen. Zu welchem Kanton passt es?",
    motifCanton: "ge",
    options: ["Bern", "Tessin", "Genf", "Zürich"],
    answer: 2,
    explanation: "Die Rhythmusgruppen 7 und 9 spielen auf «septante» und «nonante» an. Das Motiv ist eine künstlerische Interpretation der Projektgruppe.",
    revealCanton: "ge",
    source: "eigen",
    verification: "eigen",
    demo: true,
  },
];
