/**
 * Erzeugt aus den offiziellen generalisierten Grenzen (BFS/swisstopo, via npm-Paket
 * «swiss-maps», BSD-3-Clause) vorprojizierte SVG-Pfade für alle 26 Kantone.
 *
 * Aufruf:  npm run geo
 * Ergebnis: src/data/geo/switzerland.generated.json
 *
 * Es werden KEINE Formen gezeichnet oder angenähert – die Pfade entstehen
 * ausschliesslich durch Projektion der Originalgeometrien.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoMercator, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";

const require = createRequire(import.meta.url);
const YEAR = "2026"; // Stand 1.1.2026 (u. a. Moutier neu im Kanton Jura)
const WIDTH = 1000;
const HEIGHT = 640;

const topo = JSON.parse(
  readFileSync(require.resolve(`swiss-maps/${YEAR}/ch-combined.json`), "utf8"),
);

const country = feature(topo, topo.objects.country);
const cantons = feature(topo, topo.objects.cantons);
const lakes = feature(topo, topo.objects.lakes);

const projection = geoMercator().fitExtent(
  [
    [10, 10],
    [WIDTH - 10, HEIGHT - 10],
  ],
  country,
);
const path = geoPath(projection).digits(1);

const r = (n) => Math.round(n * 10) / 10;

const out = {
  meta: {
    source:
      "Bundesamt für Statistik (BFS), Generalisierte Gemeindegrenzen, Stand " +
      YEAR +
      "; aufbereitet durch Interactive Things im npm-Paket swiss-maps@4.7.0 (BSD-3-Clause)",
    projection: "Mercator (d3-geo), fitExtent auf " + WIDTH + "×" + HEIGHT,
    year: YEAR,
  },
  width: WIDTH,
  height: HEIGHT,
  country: path(country),
  borders: path(mesh(topo, topo.objects.cantons, (a, b) => a !== b)),
  lakes: lakes.features.map((f) => path(f)),
  cantons: cantons.features
    .map((f) => {
      const [[x0, y0], [x1, y1]] = path.bounds(f);
      const [cx, cy] = path.centroid(f);
      return {
        bfs: Number(f.id),
        d: path(f),
        centroid: [r(cx), r(cy)],
        bounds: [r(x0), r(y0), r(x1), r(y1)],
        area: Math.round(path.area(f)),
      };
    })
    .sort((a, b) => a.bfs - b.bfs),
};

writeFileSync(
  new URL("../src/data/geo/switzerland.generated.json", import.meta.url),
  JSON.stringify(out),
);
console.log(
  "OK:",
  out.cantons.length,
  "Kantone,",
  out.lakes.length,
  "Seen,",
  (JSON.stringify(out).length / 1024).toFixed(0),
  "KB",
);
