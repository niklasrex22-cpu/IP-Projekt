import { useEffect, useState } from "react";
import { audio, usePlayback } from "../audio/engine";

/** Liefert den Wiedergabefortschritt (0…1) und die verstrichene Zeit der Quelle, falls sie läuft. */
export function useProgress(sourceId: string | null): { progress: number; elapsed: number; active: boolean } {
  const pb = usePlayback();
  const active = !!sourceId && pb.playing && pb.sourceId === sourceId;
  const [, force] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last > 50) {
        last = t;
        force((n) => n + 1);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return { progress: active ? audio.progress() : 0, elapsed: active ? audio.elapsed() : 0, active };
}
