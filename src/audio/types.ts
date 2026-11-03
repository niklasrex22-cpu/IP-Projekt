/**
 * Notationssystem für die generierten Demo-Klangmotive.
 *
 * Eine Stimme (voice) wird als Textfolge notiert – ein Zeichen-Token pro Rasterschritt:
 *   "0"  … Skalenstufe (0 = Grundton, 1 = zweite Stufe … negative Zahlen = tiefer)
 *   "-"  … vorherigen Ton halten (verlängern)
 *   "."  … Pause
 * Beispiel: "0 - 2 . 4 4 2 -"
 *
 * Drums werden als Raster notiert: "x" = betont, "o" = leise, "." = Pause.
 *
 * WICHTIG: Alle Motive sind künstlerische Interpretationen der Projektgruppe
 * und KEINE traditionelle Musik eines Kantons.
 */

export type Timbre =
  | "marimba"
  | "glass"
  | "pluck"
  | "flute"
  | "pad"
  | "bell"
  | "reed"
  | "bass"
  | "string";

export type DrumSound = "kick" | "snare" | "hat" | "wood" | "rim";

export interface VoiceSpec {
  /** Beschriftung, z. B. «Melodie» oder «Rätoromanisch-Stimme» */
  label: string;
  timbre: Timbre;
  /** Oktavverschiebung gegenüber rootMidi */
  octave: number;
  pattern: string;
  gain?: number;
  /** -1 (links) … 1 (rechts) */
  pan?: number;
  /** gleitende Tonübergänge (Portamento) */
  glide?: boolean;
  /** Einsatz erst ab Takt n (für Kanons) */
  startBar?: number;
}

export interface DrumSpec {
  sound: DrumSound;
  pattern: string;
  gain?: number;
}

export interface MotifSpec {
  title: string;
  bpm: number;
  /** Anzeige, z. B. "3/4" */
  meter: string;
  /** Rasterschritte pro Takt */
  stepsPerBar: number;
  /** Rasterschritte pro Schlag (Viertel = 1 → 2 heisst Achtel) */
  stepsPerBeat: number;
  /** MIDI-Notennummer des Grundtons (60 = c') */
  rootMidi: number;
  /** Tonleiter als Halbtonabstände ab Grundton */
  scale: number[];
  scaleName: string;
  bars: number;
  voices: VoiceSpec[];
  drums: DrumSpec[];
  /** Hallanteil 0…1 */
  reverb?: number;
  /** Gestaltungsidee in Worten */
  idea: string;
  /** Verbindung zur Bildgestaltung */
  visualLink: string;
  /** true = automatisch erzeugt (noch nicht von der Musikgruppe gestaltet) */
  generated?: boolean;
}

export interface MusicEvent {
  /** AudioContext-Zeit */
  time: number;
  kind: "note" | "drum";
  voice: number;
  /** MIDI-Tonhöhe (Noten) */
  midi?: number;
  /** 0…1 */
  velocity: number;
  duration: number;
  /** Schritt im Raster */
  step: number;
}

export interface ScheduledNote {
  voice: number;
  midi: number;
  startStep: number;
  lengthSteps: number;
}
