/**
 * Rap aus den Kantonen – Recherche der Projektgruppe.
 *
 * Die Lieder sind urheberrechtlich geschützt und werden darum NICHT als Audiodatei
 * in die Website eingebaut. Stattdessen:
 *  - Links zu YouTube und Spotify (öffnen in einem neuen Tab)
 *  - optional `videoUrl`: direkter YouTube-Link, z. B. mit Startzeit des Hooks
 *    ("https://www.youtube.com/watch?v=XXXX&t=45s")
 *  - optional `hookUrl`: EIGENE Aufnahme des Hooks (selbst gerappt/eingespielt),
 *    Datei unter public/assets/audio/music/, z. B. "assets/audio/music/zh-hook.mp3"
 *
 * Alle Angaben stammen aus der Liste der Projektgruppe und sind vor der Präsentation zu prüfen.
 */

export interface RapTrack {
  artist: string;
  /** Liedtitel, falls bekannt */
  song?: string;
  note?: string;
  /** Direkter Video-Link (am besten mit Startzeit des Hooks) */
  videoUrl?: string;
  /** Titel des verlinkten Videos (wenn es nicht das oben genannte Lied ist) */
  videoTitle?: string;
  /** Eigene Hook-Aufnahme (Pfad unter public/) */
  hookUrl?: string;
}

export interface CantonRap {
  tracks: RapTrack[];
  /** Hinweis, wenn kein Rap gefunden wurde */
  missing?: string;
}

export const RAP: Record<string, CantonRap> = {
  zh: {
    tracks: [
      {
        artist: "BODY feat. Biggo",
        note: "Von der Projektgruppe ausgewählt. Hook: 8 Takte ab 0:19 (0:19–0:33). Interpret bitte ergänzen.",
        hookUrl: "assets/audio/music/zh-hook-body.mp3",
      },
      {
        artist: "Bligg",
        song: "Manhattan",
        note: "Bligg stammt aus Zürich. Hook: Refrain ab 1:36 (1:36–1:52).",
        hookUrl: "assets/audio/music/zh-hook-manhattan.mp3",
      },
    ],
  },
  be: {
    tracks: [
      { artist: "Lo & Leduc", song: "079", videoUrl: "https://www.youtube.com/watch?v=kEQE7_qJA48" },
      { artist: "Greis", note: "Weiterer Berner Rapper.", videoUrl: "https://www.youtube.com/watch?v=OJ3v8ErC4Vc", videoTitle: "Global" },
      { artist: "Baze", note: "Weiterer Berner Rapper.", videoUrl: "https://www.youtube.com/watch?v=_1sDueWzh3s", videoTitle: "Bounce Cypher 2025 (SRF)" },
    ],
  },
  lu: {
    tracks: [
      {
        artist: "Mimiks",
        song: "Hässig für immer",
        note: "Von der Projektgruppe ausgewählt (Interpret bitte prüfen). Hook: Refrain ab 1:55 (1:55–2:10).",
        hookUrl: "assets/audio/music/lu-hook-haessig.mp3",
        videoUrl: "https://www.youtube.com/watch?v=15gc0W8wypM",
        videoTitle: "Bounce Cypher 2025 (SRF)",
      },
      { artist: "Zora", note: "Rapperin aus Luzern." },
    ],
  },
  ur: { tracks: [], missing: "Keine bekannte Rap-Grösse gefunden." },
  sz: { tracks: [{ artist: "C.mEE", note: "Herkunft: Kanton Schwyz.", videoUrl: "https://www.youtube.com/watch?v=4o09V_aXWyE", videoTitle: "Obsessions" }] },
  ow: { tracks: [], missing: "Keine bekannte Rap-Grösse gefunden." },
  nw: { tracks: [], missing: "Keine bekannte Rap-Grösse gefunden." },
  gl: { tracks: [{ artist: "Radical (Trick77)", note: "Herkunft: Glarus.", videoUrl: "https://www.youtube.com/watch?v=6TbpilAt92Y", videoTitle: "Ringkampf (live in Glarus, 2010)" }] },
  zg: { tracks: [{ artist: "Fratelli-B", song: "Ha ke Bock", note: "Die beiden kommen aus Baar im Kanton Zug." }] },
  fr: { tracks: [{ artist: "La'Krymog'n", song: "On passe à l'assaut (Album)", note: "Das Duo steht für Rap «made in Fribourg»." }] },
  so: { tracks: [{ artist: "Manillio", videoUrl: "https://www.youtube.com/watch?v=qgVtP_3n5DM", videoTitle: "Wo Mi Findsch" }, { artist: "Cobee", videoUrl: "https://www.youtube.com/watch?v=oe7S3IEyuPM", videoTitle: "Tabula Rasa!" }] },
  bs: {
    tracks: [
      { artist: "P-27 feat. Black Tiger", song: "Murder by Dialect", note: "1991 – gilt als erster Rap auf Baseldeutsch.", videoUrl: "https://www.youtube.com/watch?v=U5dRP5YNfDE" },
      { artist: "Brandhärd", note: "Bekannte Basler Gruppe.", videoUrl: "https://www.youtube.com/watch?v=UB4jpj3LF5U", videoTitle: "Noochbrand" },
    ],
  },
  bl: { tracks: [], missing: "Keine klare Zuordnung gefunden." },
  sh: { tracks: [], missing: "Keine bekannte Rap-Grösse gefunden." },
  ar: {
    tracks: [{ artist: "Bligg", song: "Volksmusigg", note: "Kein Rapper aus Appenzell – als Ersatz ein Mix aus Rap und Volksmusik, gemeinsam mit der Streichmusik Alder aus Appenzell.", videoUrl: "https://www.youtube.com/watch?v=yHxHblUjf-w" }],
  },
  ai: {
    tracks: [{ artist: "Bligg", song: "Volksmusigg", note: "Kein Rapper aus Appenzell – als Ersatz ein Mix aus Rap und Volksmusik, gemeinsam mit der Streichmusik Alder aus Appenzell.", videoUrl: "https://www.youtube.com/watch?v=yHxHblUjf-w" }],
  },
  sg: { tracks: [{ artist: "Monet192", videoUrl: "https://www.youtube.com/watch?v=S0NJKZaRClc", videoTitle: "Vorbei" }, { artist: "E.S.I.K." }] },
  gr: {
    tracks: [
      { artist: "Gimma", note: "Aus Chur.", videoUrl: "https://www.youtube.com/watch?v=UNRhdileRwg", videoTitle: "Superschwiizer" },
      { artist: "Sektion Kuchikäschtli", note: "Aus Igis.", videoUrl: "https://www.youtube.com/watch?v=WBJmqb6xsG8", videoTitle: "Lampafiaber" },
      { artist: "Liricas Analas", note: "Rappen auf Romanisch.", videoUrl: "https://www.youtube.com/watch?v=eRvM2KKDeGA", videoTitle: "Siemis" },
    ],
  },
  ag: { tracks: [{ artist: "L.A.B", song: "Still got a Mic", note: "Aus Killwangen AG. Mit dem Song gewann er im Dezember 2023 den kleinen Prix Walo." }] },
  tg: { tracks: [{ artist: "Raboose", note: "Mit Wurzeln im Thurgau.", videoUrl: "https://www.youtube.com/watch?v=70zjqOCOREo", videoTitle: "Wenn I Boose Bi" }] },
  ti: { tracks: [{ artist: "Mattak", note: "Aus Comano.", videoUrl: "https://www.youtube.com/watch?v=4nyZHhevGjo", videoTitle: "Lacrime di coccodrillo" }] },
  vd: {
    tracks: [
      { artist: "Sens Unik", note: "Pioniere aus Renens und Lausanne.", videoUrl: "https://www.youtube.com/watch?v=6-bjVVKs32E", videoTitle: "Le jour d'après (feat. Shurik'n, 1999)" },
      { artist: "Stress", videoUrl: "https://www.youtube.com/watch?v=XZr1lA55dOA", videoTitle: "Libéré" },
      { artist: "La Gale", videoUrl: "https://www.youtube.com/watch?v=9IcVL0NWXwc", videoTitle: "14%" },
    ],
  },
  vs: { tracks: [{ artist: "Jeune Hustler", videoUrl: "https://www.youtube.com/watch?v=gwrRkY32Q_g", videoTitle: "11 de Légende" }] },
  ne: { tracks: [{ artist: "L'Âge Béni", note: "Ältere Crew." }] },
  ge: { tracks: [{ artist: "Di-Meh", videoUrl: "https://www.youtube.com/watch?v=YbNVtFrnrGs", videoTitle: "Nonante-Huit (feat. Mairo)" }, { artist: "Slimka", videoUrl: "https://www.youtube.com/watch?v=Xfb7tvxAbpA", videoTitle: "Mystico" }] },
  ju: { tracks: [{ artist: "Baby Volcano", note: "Rappt auf Spanisch.", videoUrl: "https://www.youtube.com/watch?v=K1XwD5R-dJE", videoTitle: "Knock Down" }] },
};

const q = (t: RapTrack) => encodeURIComponent([t.artist, t.song].filter(Boolean).join(" "));

/** Hinweis: Wer den Hook direkt ansteuern will, hängt an videoUrl «&t=45s» an (45 = Sekunde, bei der der Hook beginnt). */
export function youtubeLink(t: RapTrack): string {
  return t.videoUrl ?? `https://www.youtube.com/results?search_query=${q(t)}`;
}

export function spotifyLink(t: RapTrack): string {
  return `https://open.spotify.com/search/${q(t)}`;
}

/** Erster Rap mit eigener Hook-Datei (wird beim Antippen des Kantons gespielt) */
export function hookFor(id: string): { track: RapTrack; index: number } | null {
  const tracks = RAP[id]?.tracks ?? [];
  const index = tracks.findIndex((t) => t.hookUrl);
  return index >= 0 ? { track: tracks[index], index } : null;
}

/** Kurzer Text für Tooltip, z. B. «Bligg – Manhattan» */
export function rapLabel(id: string): string | null {
  const r = RAP[id];
  const t = r?.tracks[0];
  if (!t) return null;
  return t.song ? `${t.artist} – «${t.song}»` : t.artist;
}
