import { audio } from "../audio/engine";
import { RAP, spotifyLink, youtubeLink } from "../data/rap";
import type { Canton } from "../data/types";
import { assetUrl } from "../lib/hooks";
import { Icon } from "./Icon";
import { PlayButton } from "./PlayButton";

/** Rap aus dem Kanton: Links zu YouTube/Spotify + eigene Hook-Aufnahme (falls vorhanden). */
export function RapSection({ canton }: { canton: Canton }) {
  const rap = RAP[canton.id];
  if (!rap) return null;
  return (
    <div className="rap">
      {rap.tracks.length === 0 && <div className="placeholder-box">{rap.missing ?? "Noch kein Rap eingetragen."}</div>}
      {rap.tracks.map((t, i) => {
        const sid = `hook:${canton.id}:${i}`;
        return (
          <article key={i} className="rap-card">
            <div className="rap-head">
              <span className="rap-mic" aria-hidden="true">
                <Icon name="mic" size={18} />
              </span>
              <div style={{ minWidth: 0 }}>
                <strong className="rap-artist">{t.artist}</strong>
                {t.song && <div className="rap-song">«{t.song}»</div>}
              </div>
            </div>
            {t.note && <p className="rap-note">{t.note}</p>}
            <div className="rap-actions">
              {t.hookUrl ? (
                <PlayButton
                  sourceId={sid}
                  size="sm"
                  label="Hook abspielen"
                  onPlay={() => void audio.playFile(sid, assetUrl(t.hookUrl!), canton.id, `${t.artist} – Hook`)}
                />
              ) : (
                <span className="chip" title="Eigene Hook-Aufnahme in src/data/rap.ts unter hookUrl eintragen">
                  Eigene Hook-Aufnahme folgt
                </span>
              )}
              <a className="btn sm ghost" href={youtubeLink(t)} target="_blank" rel="noreferrer">
                YouTube <Icon name="arrow" size={14} />
              </a>
              <a className="btn sm ghost" href={spotifyLink(t)} target="_blank" rel="noreferrer">
                Spotify <Icon name="arrow" size={14} />
              </a>
            </div>
          </article>
        );
      })}
      <p className="muted" style={{ fontSize: 12 }}>
        Recherche der Projektgruppe – vor der Präsentation prüfen. Die Lieder sind urheberrechtlich geschützt und öffnen darum auf YouTube bzw.
        Spotify.
      </p>
    </div>
  );
}
