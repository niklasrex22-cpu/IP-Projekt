import { useEffect, useSyncExternalStore } from "react";

/**
 * Minimaler Hash-Router (#/karte/be). Funktioniert ohne Serverkonfiguration,
 * also auch auf GitHub Pages, einem Schulserver oder direkt aus dem dist-Ordner.
 */
export type PageKey = "start" | "karte" | "klanglabor" | "vergleich" | "quiz" | "projekt" | "wappen";

export interface Route {
  page: PageKey;
  params: string[];
}

const PAGES: PageKey[] = ["start", "karte", "klanglabor", "vergleich", "quiz", "projekt", "wappen"];

function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const page = (parts[0] ?? "start") as PageKey;
  if (!PAGES.includes(page)) return { page: "start", params: [] };
  return { page, params: parts.slice(1) };
}

let current = parse(window.location.hash);
const listeners = new Set<() => void>();
window.addEventListener("hashchange", () => {
  current = parse(window.location.hash);
  listeners.forEach((l) => l());
});

export function useRoute(): Route {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => current,
  );
}

export function href(page: PageKey, ...params: (string | undefined)[]): string {
  const p = params.filter(Boolean) as string[];
  return "#/" + (page === "start" ? "" : [page, ...p].map(encodeURIComponent).join("/"));
}

export function navigate(page: PageKey, ...params: (string | undefined)[]) {
  const h = href(page, ...params);
  if (window.location.hash !== h) window.location.hash = h;
}

/** Ersetzt den Eintrag in der History (z. B. Kantonswechsel auf der Karte) */
export function replaceRoute(page: PageKey, ...params: (string | undefined)[]) {
  const h = href(page, ...params);
  if (window.location.hash === h) return;
  history.replaceState(null, "", h);
  current = parse(h);
  listeners.forEach((l) => l());
}

export function useScrollTopOnPage(page: PageKey) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);
}
