import type { Verification } from "../data/types";

const LABEL: Record<Verification, string> = {
  amtlich: "Amtlich",
  literatur: "Literatur – prüfen",
  eigen: "Eigene Gestaltung",
  platzhalter: "Platzhalter",
};

const TITLE: Record<Verification, string> = {
  amtlich: "Amtliche Angabe (Verfassung, BFS, Kanton)",
  literatur: "In der angegebenen Fachliteratur dokumentiert – Seitenangabe vor der Präsentation am Original prüfen",
  eigen: "Eigene künstlerische Gestaltung der Projektgruppe",
  platzhalter: "Noch nicht recherchiert – muss ersetzt werden",
};

export function Badge({ v }: { v: Verification }) {
  return (
    <span className={`badge ${v}`} title={TITLE[v]}>
      {LABEL[v]}
    </span>
  );
}
