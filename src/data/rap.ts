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
  /** Eigene Hook-Aufnahme (Pfad unter public/) */
  hookUrl?: string;
}

export interface CantonRap {
  tracks: RapTrack[];
  /** Hinweis, wenn kein Rap gefunden wurde */
  missing?: string;
}

export const RAP: Record<string, CantonRap> = {
  zh: { tracks: [{ artist: "Bligg", song: "Rosalie", note: "Bligg stammt aus Zürich." }] },
  be: {
    tracks: [
      { artist: "Lo & Leduc", song: "079" },
      { artist: "Greis", note: "Weiterer Berner Rapper." },
      { artist: "Baze", note: "Weiterer Berner Rapper." },
    ],
  },
  lu: { tracks: [{ artist: "Mimiks" }, { artist: "Zora", note: "Rapperin aus Luzern." }] },
  ur: { tracks: [], missing: "Keine bekannte Rap-Grösse gefunden." },
  sz: { tracks: [{ artist: "C.mEE", note: "Herkunft: Kanton Schwyz." }] },
  ow: { tracks: [], missing: "Keine bekannte Rap-Grösse gefunden." },
  nw: { tracks: [], missing: "Keine bekannte Rap-Grösse gefunden." },
  gl: { tracks: [{ artist: "Radical (Trick77)", note: "Herkunft: Glarus." }] },
  zg: { tracks: [{ artist: "Fratelli-B", song: "Ha ke Bock", note: "Die beiden kommen aus Baar im Kanton Zug." }] },
  fr: { tracks: [{ artist: "La'Krymog'n", song: "On passe à l'assaut (Album)", note: "Das Duo steht für Rap «made in Fribourg»." }] },
  so: { tracks: [{ artist: "Manillio" }, { artist: "Cobee" }] },
  bs: {
    tracks: [
      { artist: "P-27 feat. Black Tiger", song: "Murder by Dialect", note: "1991 – gilt als erster Rap auf Baseldeutsch." },
      { artist: "Brandhärd", note: "Bekannte Basler Gruppe." },
    ],
  },
  bl: { tracks: [], missing: "Keine klare Zuordnung gefunden." },
  sh: { tracks: [], missing: "Keine bekannte Rap-Grösse gefunden." },
  ar: {
    tracks: [{ artist: "Bligg", song: "Volksmusigg", note: "Kein Rapper aus Appenzell – als Ersatz ein Mix aus Rap und Volksmusik." }],
  },
  ai: {
    tracks: [{ artist: "Bligg", song: "Volksmusigg", note: "Kein Rapper aus Appenzell – als Ersatz ein Mix aus Rap und Volksmusik." }],
  },
  sg: { tracks: [{ artist: "Monet192" }, { artist: "E.S.I.K." }] },
  gr: {
    tracks: [
      { artist: "Gimma", note: "Aus Chur." },
      { artist: "Sektion Kuchikäschtli", note: "Aus Igis." },
      { artist: "Liricas Analas", note: "Rappen auf Romanisch." },
    ],
  },
  ag: { tracks: [{ artist: "L.A.B", song: "Still got a Mic", note: "Damit gewann er den kleinen Prix Walo." }] },
  tg: { tracks: [{ artist: "Raboose", note: "Mit Wurzeln im Thurgau." }] },
  ti: { tracks: [{ artist: "Mattak", note: "Aus Comano." }] },
  vd: {
    tracks: [
      { artist: "Sens Unik", note: "Pioniere aus Renens und Lausanne." },
      { artist: "Stress" },
      { artist: "La Gale" },
    ],
  },
  vs: { tracks: [{ artist: "Jeune Hustler" }] },
  ne: { tracks: [{ artist: "L'Âge Béni", note: "Ältere Crew." }] },
  ge: { tracks: [{ artist: "Di-Meh" }, { artist: "Slimka" }] },
  ju: { tracks: [{ artist: "Baby Volcano", note: "Rappt auf Spanisch." }] },
};

const q = (t: RapTrack) => encodeURIComponent([t.artist, t.song].filter(Boolean).join(" "));

export function youtubeLink(t: RapTrack): string {
  return t.videoUrl ?? `https://www.youtube.com/results?search_query=${q(t)}`;
}

export function spotifyLink(t: RapTrack): string {
  return `https://open.spotify.com/search/${q(t)}`;
}

/** Kurzer Text für Tooltip, z. B. «Bligg – Rosalie» */
export function rapLabel(id: string): string | null {
  const r = RAP[id];
  const t = r?.tracks[0];
  if (!t) return null;
  return t.song ? `${t.artist} – «${t.song}»` : t.artist;
}
