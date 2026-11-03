import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [v, setV] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const h = () => setV(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

/** Setzt die Akzentfarbe der gesamten Seite (weiche Überblendung via @property). */
export function useAccent(color: string | undefined) {
  useEffect(() => {
    if (!color) return;
    document.documentElement.style.setProperty("--accent", color);
  }, [color]);
}

export function assetUrl(path: string): string {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}

export function formatTime(s: number): string {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}
