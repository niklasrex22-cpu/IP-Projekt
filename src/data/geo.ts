import geo from "./geo/switzerland.generated.json";
import { CANTON_BY_BFS } from "./cantons";
import type { Canton } from "./types";

export interface CantonShape {
  canton: Canton;
  d: string;
  centroid: [number, number];
  bounds: [number, number, number, number];
  area: number;
}

interface GeoFile {
  meta: { source: string; projection: string; year: string };
  width: number;
  height: number;
  country: string;
  borders: string;
  lakes: string[];
  cantons: { bfs: number; d: string; centroid: number[]; bounds: number[]; area: number }[];
}

const g = geo as GeoFile;

export const MAP_WIDTH = g.width;
export const MAP_HEIGHT = g.height;
export const COUNTRY_PATH = g.country;
export const BORDERS_PATH = g.borders;
export const LAKE_PATHS = g.lakes;
export const GEO_META = g.meta;

/** Manuelle Feinjustierung der Beschriftungspunkte (nur Position der Labels, nicht der Grenzen!) */
const LABEL_OFFSET: Record<string, [number, number]> = {
  bs: [-4, -10],
  bl: [4, 8],
  ai: [4, 10],
  ar: [-10, -8],
  nw: [-2, 8],
  ow: [-8, 4],
  vd: [10, -14],
  ge: [6, -2],
  fr: [0, 6],
  so: [6, -10],
  sz: [6, 4],
  zg: [-2, -2],
};

export const SHAPES: CantonShape[] = g.cantons.map((c) => {
  const canton = CANTON_BY_BFS[c.bfs];
  if (!canton) throw new Error(`Kein Datensatz für BFS-Nr. ${c.bfs}`);
  return {
    canton,
    d: c.d,
    centroid: [c.centroid[0], c.centroid[1]],
    bounds: [c.bounds[0], c.bounds[1], c.bounds[2], c.bounds[3]],
    area: c.area,
  };
});

export const SHAPE_BY_ID: Record<string, CantonShape> = Object.fromEntries(SHAPES.map((s) => [s.canton.id, s]));

export function labelPoint(s: CantonShape): [number, number] {
  const o = LABEL_OFFSET[s.canton.id] ?? [0, 0];
  return [s.centroid[0] + o[0], s.centroid[1] + o[1]];
}

/** Kleine Kantone erhalten eine zusätzliche Klickfläche (Touch-tauglich). */
export const SMALL_AREA = 1400;
