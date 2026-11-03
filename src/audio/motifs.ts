import type { DrumSpec, MotifSpec, Timbre, VoiceSpec } from "./types";

/**
 * Demo-Klangmotive.
 *
 * ⚠️ Alle Motive sind KÜNSTLERISCHE INTERPRETATIONEN der Projektgruppe,
 * erzeugt mit der Web Audio API. Sie sind keine traditionelle oder
 * authentische Musik der jeweiligen Kantone.
 *
 * Die sechs Beispielkantone sind von Hand gestaltet; ihre Gestaltungsidee
 * knüpft jeweils an ein sprachliches Phänomen aus der Dialektbibliothek an.
 * Alle übrigen Kantone erhalten ein automatisch erzeugtes Platzhalter-Motiv,
 * das die Musikgruppe durch eine eigene Komposition ersetzen soll.
 *
 * Ein eigenes Motiv bearbeiten: einfach die Felder unten verändern
 * (Notation siehe src/audio/types.ts).
 */

const MAJOR_PENTA = [0, 2, 4, 7, 9];
const DORIAN = [0, 2, 3, 5, 7, 9, 10];
const MIXOLYDIAN = [0, 2, 4, 5, 7, 9, 10];
const LYDIAN = [0, 2, 4, 6, 7, 9, 11];
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR_PENTA = [0, 3, 5, 7, 10];
const AEOLIAN = [0, 2, 3, 5, 7, 8, 10];
const WHOLE = [0, 2, 4, 6, 8, 10];

export const HANDMADE_MOTIFS: Record<string, MotifSpec> = {
  be: {
    title: "Gleitende Vokale",
    bpm: 84,
    meter: "3/4",
    stepsPerBar: 6,
    stepsPerBeat: 2,
    rootMidi: 62, // d'
    scale: MAJOR_PENTA,
    scaleName: "D-Dur-Pentatonik",
    bars: 12,
    reverb: 0.3,
    voices: [
      { label: "Melodie (gleitend)", timbre: "flute", octave: 1, glide: true, pattern: "0 - 2 - 3 - 4 - - - 3 2 1 - 0 - - - 2 - 4 - 5 - 4 - 3 - - - 2 - 1 - - - - -", gain: 0.9 },
      { label: "Holz-Begleitung", timbre: "marimba", octave: 0, pattern: "0 . 2 . 4 . -1 . 1 . 3 . 0 . 2 . 4 . 1 . 3 . 4 .", gain: 0.7, pan: -0.3 },
      { label: "Bass", timbre: "bass", octave: -1, pattern: "0 - - - - - -2 - - - - - 0 - - - - - -1 - - - - -", gain: 0.6 },
    ],
    drums: [{ sound: "wood", pattern: "x . o . o .", gain: 0.6 }],
    idea:
      "Im Berndeutschen wird das «l» vor Konsonanten oft wie «u» gesprochen (Milch → Miuch). Dieses Gleiten von einem Laut in den nächsten wird musikalisch übersetzt: Die Flötenstimme gleitet (Portamento) von Ton zu Ton, statt zu springen. Der ruhige 3/4-Takt lässt den Tönen Zeit zum Ausklingen.",
    visualLink:
      "Gestalterisch entsprechen den Glissandi weiche, ineinanderfliessende Bögen – in der künstlerischen Karte als Wellenlinien-Struktur.",
  },
  zh: {
    title: "Gläserne Pulse",
    bpm: 112,
    meter: "4/4",
    stepsPerBar: 8,
    stepsPerBeat: 2,
    rootMidi: 57, // a
    scale: DORIAN,
    scaleName: "A-Dorisch",
    bars: 9,
    reverb: 0.22,
    voices: [
      { label: "Glas-Melodie", timbre: "glass", octave: 1, pattern: "0 . 2 4 . 4 3 . 2 . 0 . 4 . 5 . 6 . 5 4 . 2 . 3 4 . 2 . 0 . . .", gain: 0.85, pan: 0.2 },
      { label: "Puls", timbre: "pluck", octave: 0, pattern: "0 0 . 0 4 . 0 . 3 3 . 3 2 . 3 .", gain: 0.6, pan: -0.25 },
      { label: "Bass", timbre: "bass", octave: -1, pattern: "0 - - - - - . . 3 - - - 2 - . .", gain: 0.6 },
    ],
    drums: [
      { sound: "kick", pattern: "x . . . x . . .", gain: 0.7 },
      { sound: "hat", pattern: ". o x o . o x o", gain: 0.8 },
      { sound: "rim", pattern: ". . . . x . . o", gain: 0.6 },
    ],
    idea:
      "Ausgangspunkt ist der Laut «ch», der im Schweizerdeutschen (z. B. «Chuchichäschtli») besonders auffällt: kurze, reibende Impulse. Daraus entstehen gezupfte, kurze Pulse und synkopierte Hi-Hats. Eine helle Glasstimme legt sich wie Lichtreflexe darüber.",
    visualLink:
      "Visuell: klare, parallele Linien und Raster – ein präziser, gläserner Rhythmus, der sich in der Rhythmus-Visualisierung als regelmässiges Pulsieren zeigt.",
  },
  bs: {
    title: "Trommel & Piccolo – Studie",
    bpm: 108,
    meter: "2/4",
    stepsPerBar: 8,
    stepsPerBeat: 4,
    rootMidi: 67, // g'
    scale: MAJOR,
    scaleName: "G-Dur",
    bars: 16,
    reverb: 0.18,
    voices: [
      { label: "Piccolo-Stimme", timbre: "flute", octave: 1, pattern: "0 - 2 - 4 - 4 2 3 - 1 - 2 - - - 4 - 5 4 3 - 2 - 1 - 2 - 0 - - - 0 - 4 - 7 - 6 - 5 4 3 2 1 - - - 2 3 4 - 3 - 1 - 0 - - - . . . .", gain: 0.8 },
      { label: "Bass", timbre: "bass", octave: -2, pattern: "0 - - - 4 - - - 0 - - - 4 - - - 3 - - - 4 - - - 0 - - - - - - -", gain: 0.5 },
    ],
    drums: [
      { sound: "snare", pattern: "x . o o x . o . x o o o x . . .", gain: 0.9 },
      { sound: "kick", pattern: "x . . . . . . . x . . . . . . .", gain: 0.5 },
    ],
    idea:
      "Die Besetzung lehnt sich an die beiden Instrumente an, die mit der Basler Fasnacht verbunden werden: Trommel und Piccolo. Es ist bewusst KEIN Fasnachtsmarsch, sondern eine eigene Studie im 2/4-Takt. Sprachlicher Bezug: Im Baseldeutschen bleibt das «k» am Wortanfang erhalten (Kind statt Chind) – entsprechend klare, harte Trommelanschläge.",
    visualLink:
      "Visuell: kräftige Punktraster (wie Trommelschläge) – in der Rhythmus-Ansicht blitzen sie als Kreise im Zentrum auf.",
  },
  gr: {
    title: "Drei Stimmen, ein Kanon",
    bpm: 76,
    meter: "6/8",
    stepsPerBar: 6,
    stepsPerBeat: 3,
    rootMidi: 60, // c'
    scale: MIXOLYDIAN,
    scaleName: "C-Mixolydisch",
    bars: 12,
    reverb: 0.38,
    voices: [
      { label: "Stimme 1 – Deutsch (Holz)", timbre: "marimba", octave: 1, pattern: "0 - 2 4 - 2 3 - 1 0 - - 4 - 5 6 - 4 2 - 1 0 - -", gain: 0.85, pan: -0.6 },
      { label: "Stimme 2 – Rätoromanisch (Glocke)", timbre: "bell", octave: 1, pattern: "0 - 2 4 - 2 3 - 1 0 - - 4 - 5 6 - 4 2 - 1 0 - -", startBar: 2, gain: 0.6, pan: 0 },
      { label: "Stimme 3 – Italienisch (Saite)", timbre: "string", octave: 0, pattern: "0 - 2 4 - 2 3 - 1 0 - - 4 - 5 6 - 4 2 - 1 0 - -", startBar: 4, gain: 0.55, pan: 0.6 },
      { label: "Bordun", timbre: "pad", octave: -1, pattern: "0 - - - - - - - - - - - 4 - - - - - - - - - - -", gain: 0.5 },
    ],
    drums: [],
    idea:
      "Graubünden ist der einzige dreisprachige Kanton (Deutsch, Rätoromanisch, Italienisch). Darum dieselbe Melodie als Kanon in drei Klangfarben: Jede Stimme setzt zwei Takte später ein und steht im Stereobild an einem anderen Ort. Die Sprachen klingen gleichzeitig, bleiben aber unterscheidbar.",
    visualLink:
      "Visuell: drei überlagerte Farbschichten in der künstlerischen Karte – die Kantonsfläche ist mehrfarbig, ohne die Sprachgebiete geografisch zu behaupten.",
  },
  ti: {
    title: "Weiche Bögen",
    bpm: 92,
    meter: "4/4",
    stepsPerBar: 8,
    stepsPerBeat: 2,
    rootMidi: 65, // f'
    scale: LYDIAN,
    scaleName: "F-Lydisch",
    bars: 9,
    reverb: 0.35,
    voices: [
      { label: "Saiten-Melodie", timbre: "string", octave: 0, pattern: "4 - - 3 2 - 1 - 2 - 3 - 4 - - - 6 - - 5 4 - 3 - 2 - - - 1 - - -", gain: 0.75 },
      { label: "Zupf-Begleitung", timbre: "pluck", octave: -1, pattern: "0 4 7 4 0 4 7 4 -2 3 5 3 -2 3 5 3", gain: 0.45, pan: 0.35 },
      { label: "Fläche", timbre: "pad", octave: 0, pattern: "0 - - - - - - - 3 - - - - - - -", gain: 0.45, pan: -0.3 },
    ],
    drums: [{ sound: "hat", pattern: "o . o . o . o o", gain: 0.5 }],
    idea:
      "Italienisch kennt im Standard viele Wörter, die auf Vokal enden. Diese offenen Silbenenden werden zu lang ausgehaltenen, bogenförmigen Phrasen; die lydische Tonleiter (mit erhöhter 4. Stufe) gibt einen hellen, schwebenden Charakter. Begleitet von gezupften Akkordbrechungen.",
    visualLink:
      "Visuell: konzentrische Bögen und runde Formen, die sich langsam ausdehnen – in der Rhythmus-Ansicht als weite Kreise.",
  },
  ge: {
    title: "Septante & Nonante",
    bpm: 132,
    meter: "7/8 + 9/8",
    stepsPerBar: 16,
    stepsPerBeat: 2,
    rootMidi: 59, // h
    scale: AEOLIAN,
    scaleName: "H-Äolisch (natürliches Moll)",
    bars: 6,
    reverb: 0.25,
    voices: [
      { label: "Klavier-Glocke", timbre: "glass", octave: 1, pattern: "0 2 4 . 2 4 6 4 2 0 . 2 4 5 4 2", gain: 0.7, pan: 0.2 },
      { label: "Rohrblatt", timbre: "reed", octave: 0, pattern: "0 - - - - - - 4 - - - 3 - - 2 - 0 - - - - - - 5 - - - 4 - - 2 -", gain: 0.45, pan: -0.25 },
      { label: "Bass", timbre: "bass", octave: -1, pattern: "0 - - . 0 - . 4 - . 3 - . 3 - .", gain: 0.6 },
    ],
    drums: [
      // Akzente: 7er-Gruppe (2+2+3) und 9er-Gruppe (2+2+2+3)
      { sound: "kick", pattern: "x . x . x . . x . x . x . x . .", gain: 0.7 },
      { sound: "wood", pattern: "o o o o o o o o o o o o o o o o", gain: 0.5 },
    ],
    idea:
      "In der Romandie sagt man «septante» (70) und «nonante» (90) statt «soixante-dix» und «quatre-vingt-dix». Daraus wird ein Zahlenspiel: Jeder Takt ist in eine 7er- und eine 9er-Gruppe aufgeteilt (7/8 + 9/8 = 16 Achtel). Die Betonungen der Bassdrum machen diese ungeraden Gruppen hörbar.",
    visualLink:
      "Visuell: Ziffernähnliche, gegliederte Blöcke – in der Rhythmus-Ansicht sieht man die unregelmässigen Akzentgruppen als unterschiedlich grosse Impulse.",
  },
};

// ── Automatisch erzeugte Platzhalter-Motive ────────────────────────────────

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SCALES: [number[], string][] = [
  [MAJOR_PENTA, "Dur-Pentatonik"],
  [MINOR_PENTA, "Moll-Pentatonik"],
  [DORIAN, "Dorisch"],
  [MIXOLYDIAN, "Mixolydisch"],
  [LYDIAN, "Lydisch"],
  [AEOLIAN, "Äolisch"],
  [WHOLE, "Ganztonleiter"],
];
const TIMBRES: Timbre[] = ["marimba", "glass", "bell", "pluck", "flute", "reed", "string"];
const METERS: { meter: string; stepsPerBar: number; stepsPerBeat: number; drum: string }[] = [
  { meter: "4/4", stepsPerBar: 8, stepsPerBeat: 2, drum: "x . o . x . o ." },
  { meter: "3/4", stepsPerBar: 6, stepsPerBeat: 2, drum: "x . o . o ." },
  { meter: "6/8", stepsPerBar: 6, stepsPerBeat: 3, drum: "x . . o . ." },
  { meter: "5/4", stepsPerBar: 10, stepsPerBeat: 2, drum: "x . o . o . x . o ." },
];
const NOTE_LETTERS = ["C", "Cis", "D", "Es", "E", "F", "Fis", "G", "As", "A", "B", "H"];

export function generatedMotif(seed: number, cantonName: string): MotifSpec {
  const rnd = mulberry32(seed * 7919 + 13);
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  const [scale, sName] = pick(SCALES);
  const m = pick(METERS);
  const root = 55 + Math.floor(rnd() * 10);
  const bpm = 80 + Math.floor(rnd() * 45);
  const len = m.stepsPerBar * 2;
  let deg = Math.floor(rnd() * 3);
  const mel: string[] = [];
  for (let i = 0; i < len; i++) {
    const r = rnd();
    if (i > 0 && r < 0.22) mel.push("-");
    else if (r < 0.32) mel.push(".");
    else {
      deg = Math.max(-2, Math.min(scale.length + 2, deg + Math.floor(rnd() * 5) - 2));
      mel.push(String(deg));
    }
  }
  mel[0] = "0";
  const voices: VoiceSpec[] = [
    { label: "Melodie", timbre: pick(TIMBRES), octave: 1, pattern: mel.join(" "), gain: 0.8 },
    {
      label: "Bass",
      timbre: "bass",
      octave: -1,
      pattern: ["0", ...Array(m.stepsPerBar - 1).fill("-"), "3", ...Array(m.stepsPerBar - 1).fill("-")].join(" "),
      gain: 0.55,
    },
  ];
  const drums: DrumSpec[] = [{ sound: rnd() > 0.5 ? "wood" : "hat", pattern: m.drum, gain: 0.6 }];
  const barDur = (m.stepsPerBar / m.stepsPerBeat) * (60 / bpm);
  return {
    title: `Platzhalter-Motiv ${cantonName}`,
    bpm,
    meter: m.meter,
    stepsPerBar: m.stepsPerBar,
    stepsPerBeat: m.stepsPerBeat,
    rootMidi: root,
    scale,
    scaleName: `${NOTE_LETTERS[root % 12]}-${sName}`,
    bars: Math.max(4, Math.round(12 / barDur)),
    reverb: 0.3,
    voices,
    drums,
    generated: true,
    idea:
      "Dieses Motiv wurde automatisch aus Zufallswerten (Tonleiter, Takt, Tempo, Klangfarbe) erzeugt und ist ein reiner Platzhalter. Es soll durch eine eigene Komposition der Musikgruppe ersetzt werden.",
    visualLink: "Noch keine gestalterische Verknüpfung – Platzhalter.",
  };
}
