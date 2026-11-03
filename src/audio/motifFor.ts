import type { Canton } from "../data/types";
import { generatedMotif, HANDMADE_MOTIFS } from "./motifs";
import type { MotifSpec } from "./types";

const cache = new Map<string, MotifSpec>();

export function motifFor(c: Canton): MotifSpec {
  let m = cache.get(c.id);
  if (!m) {
    m = HANDMADE_MOTIFS[c.id] ?? generatedMotif(c.bfs, c.name);
    cache.set(c.id, m);
  }
  return m;
}
