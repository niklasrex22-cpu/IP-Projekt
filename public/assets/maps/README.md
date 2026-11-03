# Kartengrundlage
Die Kantonsgrenzen stammen aus den generalisierten Gemeindegrenzen des Bundesamts für Statistik (BFS),
Stand 1.1.2026 (Basis swisstopo), in der TopoJSON-Aufbereitung des npm-Pakets `swiss-maps` 4.7.0
(Interactive Things, BSD-3-Clause).

`npm run geo` projiziert die Originalgeometrien (Mercator, d3-geo) und schreibt das Ergebnis nach
`src/data/geo/switzerland.generated.json`. Die Formen werden nicht von Hand verändert.
