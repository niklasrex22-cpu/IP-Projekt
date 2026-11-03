import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { BORDERS_PATH, COUNTRY_PATH, LAKE_PATHS, MAP_HEIGHT, MAP_WIDTH, SHAPES, SHAPE_BY_ID, SMALL_AREA, labelPoint, type CantonShape } from "../data/geo";
import { LANGUAGE_LABEL } from "../data/types";
import { audio } from "../audio/engine";
import { assetUrl, useReducedMotion } from "../lib/hooks";

export type MapMode = "art" | "geo" | "wappen";

export interface SwissMapHandle {
  reset: () => void;
  zoomBy: (f: number) => void;
  focus: (id: string) => void;
}

interface Props {
  mode: MapMode;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Zusätzlich hervorgehobene Kantone (Vergleich) */
  marked?: string[];
  interactive?: boolean;
  /** Startseite: dezente pulsierende Klangpunkte */
  ambient?: boolean;
  /** Automatisch auf den ausgewählten Kanton fokussieren */
  autoFocus?: boolean;
  className?: string;
  ariaLabel?: string;
  handleRef?: Ref<SwissMapHandle>;
}

interface VB {
  x: number;
  y: number;
  w: number;
  h: number;
}

const FULL: VB = { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT };
const ASPECT = MAP_HEIGHT / MAP_WIDTH;
const MIN_W = MAP_WIDTH / 14;

/** Grafische Strukturen der künstlerischen Karte (BG) */
const PATTERNS = ["lines", "dots", "waves", "grid", "rings", "diag"] as const;
const PATTERN_OF: Record<string, (typeof PATTERNS)[number]> = {
  be: "waves",
  zh: "lines",
  bs: "dots",
  gr: "rings",
  ti: "rings",
  ge: "grid",
};

function clampVB(v: VB): VB {
  const w = Math.min(MAP_WIDTH * 1.05, Math.max(MIN_W, v.w));
  const h = w * ASPECT;
  const mx = MAP_WIDTH * 0.25;
  const my = MAP_HEIGHT * 0.25;
  const x = Math.min(MAP_WIDTH - w + mx, Math.max(-mx, v.x));
  const y = Math.min(MAP_HEIGHT - h + my, Math.max(-my, v.y));
  return { x, y, w, h };
}

function vbFor(s: CantonShape): VB {
  const [x0, y0, x1, y1] = s.bounds;
  const pad = 1.35;
  let w = Math.max((x1 - x0) * pad, ((y1 - y0) * pad) / ASPECT, 150);
  w = Math.min(w, MAP_WIDTH);
  const h = w * ASPECT;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return clampVB({ x: cx - w / 2, y: cy - h / 2, w, h });
}

const ease = (t: number) => 1 - Math.pow(1 - t, 4);

export function SwissMap({
  mode,
  selectedId = null,
  onSelect,
  marked = [],
  interactive = true,
  ambient = false,
  autoFocus = true,
  className = "",
  ariaLabel = "Interaktive Karte der Schweiz mit 26 Kantonen",
  handleRef,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rippleRef = useRef<SVGGElement>(null);
  const vb = useRef<VB>({ ...FULL });
  const anim = useRef(0);
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const drag = useRef<{ id: number; x: number; y: number; vb: VB; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; vb: VB; cx: number; cy: number } | null>(null);
  const suppressClick = useRef(false);

  /** Wendet die aktuelle Ansicht an (ohne React-Rerender → flüssig auch auf schwachen Geräten). */
  const apply = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const v = vb.current;
    svg.setAttribute("viewBox", `${v.x.toFixed(2)} ${v.y.toFixed(2)} ${v.w.toFixed(2)} ${v.h.toFixed(2)}`);
    const k = v.w / MAP_WIDTH;
    svg.style.setProperty("--k", String(k));
    svg.querySelectorAll<SVGCircleElement>("circle.hit").forEach((c) => c.setAttribute("r", String(10 * k)));
    svg.querySelectorAll<SVGImageElement>("image.map-wappen").forEach((img) => {
      const base = Number(img.dataset.base);
      const s = base * Math.pow(k, 0.75);
      img.setAttribute("width", String(s));
      img.setAttribute("height", String(s));
      img.setAttribute("x", String(Number(img.dataset.cx) - s / 2));
      img.setAttribute("y", String(Number(img.dataset.cy) - s / 2));
    });
  }, []);

  const animateTo = useCallback(
    (target: VB) => {
      cancelAnimationFrame(anim.current);
      const from = { ...vb.current };
      const to = clampVB(target);
      if (reduced) {
        vb.current = to;
        apply();
        return;
      }
      const t0 = performance.now();
      const dur = 750;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const e = ease(t);
        vb.current = {
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e,
          w: from.w + (to.w - from.w) * e,
          h: from.h + (to.h - from.h) * e,
        };
        apply();
        if (t < 1) anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
    },
    [apply, reduced],
  );

  const zoomAround = useCallback(
    (f: number, px?: number, py?: number) => {
      const v = vb.current;
      const cx = px ?? v.x + v.w / 2;
      const cy = py ?? v.y + v.h / 2;
      const w = Math.min(MAP_WIDTH * 1.05, Math.max(MIN_W, v.w / f));
      const real = v.w / w;
      vb.current = clampVB({ x: cx - (cx - v.x) / real, y: cy - (cy - v.y) / real, w, h: w * ASPECT });
      apply();
    },
    [apply],
  );

  useImperativeHandle(
    handleRef,
    () => ({
      reset: () => animateTo(FULL),
      zoomBy: (f: number) => {
        const v = vb.current;
        const w = v.w / f;
        animateTo({ x: v.x + (v.w - w) / 2, y: v.y + (v.h - w * ASPECT) / 2, w, h: w * ASPECT });
      },
      focus: (id: string) => {
        const s = SHAPE_BY_ID[id];
        if (s) animateTo(vbFor(s));
      },
    }),
    [animateTo],
  );

  useEffect(() => {
    apply();
  }, [apply, mode]);

  // Kamera fokussiert sanft auf den ausgewählten Kanton
  useEffect(() => {
    if (!autoFocus) return;
    if (selectedId && SHAPE_BY_ID[selectedId]) animateTo(vbFor(SHAPE_BY_ID[selectedId]));
    else animateTo(FULL);
  }, [selectedId, autoFocus, animateTo]);

  // Musikalische Ereignisse lösen kleine Reaktionen auf der Karte aus
  useEffect(() => {
    let lastT = 0;
    return audio.onMusicEvent((e) => {
      const g = rippleRef.current;
      if (!g || !e.cantonId) return;
      const s = SHAPE_BY_ID[e.cantonId];
      if (!s) return;
      const now = performance.now();
      if (now - lastT < (reduced ? 400 : 90)) return;
      lastT = now;
      const k = vb.current.w / MAP_WIDTH;
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const jitter = e.kind === "note" ? ((e.midi ?? 60) % 12) - 6 : 0;
      c.setAttribute("cx", String(s.centroid[0] + jitter * 1.6 * k));
      c.setAttribute("cy", String(s.centroid[1] - (e.kind === "note" ? ((e.midi ?? 60) - 60) * 0.6 * k : 0)));
      c.setAttribute("r", String((e.kind === "drum" ? 14 : 6 + e.velocity * 6) * k));
      c.setAttribute("class", e.kind === "drum" ? "ripple drum" : "ripple");
      c.style.setProperty("--rc", s.canton.color);
      c.addEventListener("animationend", () => c.remove());
      g.appendChild(c);
      if (g.childNodes.length > 40) g.firstChild?.remove();
    });
  }, [reduced]);

  // ── Zeiger: Ziehen, Pinch-Zoom ──
  const toSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    cancelAnimationFrame(anim.current);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const c = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2);
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), vb: { ...vb.current }, cx: c.x, cy: c.y };
      drag.current = null;
    } else {
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, vb: { ...vb.current }, moved: false };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!interactive) return;
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const f = d / pinch.current.d;
      const p = pinch.current;
      const w = Math.min(MAP_WIDTH * 1.05, Math.max(MIN_W, p.vb.w / f));
      const real = p.vb.w / w;
      vb.current = clampVB({ x: p.cx - (p.cx - p.vb.x) / real, y: p.cy - (p.cy - p.vb.y) / real, w, h: w * ASPECT });
      apply();
      suppressClick.current = true;
      return;
    }
    const dr = drag.current;
    if (dr && dr.id === e.pointerId) {
      const dx = e.clientX - dr.x;
      const dy = e.clientY - dr.y;
      if (!dr.moved && Math.hypot(dx, dy) > 5) {
        dr.moved = true;
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
        setHover(null);
      }
      if (dr.moved) {
        const rect = svgRef.current!.getBoundingClientRect();
        const scale = Math.max(dr.vb.w / rect.width, dr.vb.h / rect.height);
        vb.current = clampVB({ ...dr.vb, x: dr.vb.x - dx * scale, y: dr.vb.y - dy * scale });
        apply();
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (drag.current?.moved) suppressClick.current = true;
    if (drag.current?.id === e.pointerId) drag.current = null;
    setTimeout(() => (suppressClick.current = false), 0);
  };

  // Mausrad-Zoom (nicht-passiver Listener, damit die Seite nicht scrollt)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !interactive) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelAnimationFrame(anim.current);
      const p = toSvg(e.clientX, e.clientY);
      zoomAround(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0018)), p.x, p.y);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [interactive, zoomAround]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive) return;
    const v = vb.current;
    const step = v.w * 0.12;
    const map: Record<string, () => void> = {
      "+": () => zoomAround(1.3),
      "=": () => zoomAround(1.3),
      "-": () => zoomAround(1 / 1.3),
      "0": () => animateTo(FULL),
      ArrowLeft: () => animateTo({ ...v, x: v.x - step }),
      ArrowRight: () => animateTo({ ...v, x: v.x + step }),
      ArrowUp: () => animateTo({ ...v, y: v.y - step }),
      ArrowDown: () => animateTo({ ...v, y: v.y + step }),
    };
    // Pfeiltasten nur, wenn die Karte selbst (nicht ein Kanton) fokussiert ist
    if (e.key.startsWith("Arrow") && e.target !== e.currentTarget) return;
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  const select = (id: string) => {
    if (suppressClick.current || !onSelect) return;
    onSelect(id);
  };

  const showHover = (id: string, e: React.PointerEvent | React.FocusEvent) => {
    if (drag.current?.moved) return;
    const wrap = wrapRef.current!.getBoundingClientRect();
    if ("clientX" in e) setHover({ id, x: e.clientX - wrap.left, y: e.clientY - wrap.top });
    else {
      const r = (e.target as Element).getBoundingClientRect();
      setHover({ id, x: r.left + r.width / 2 - wrap.left, y: r.top - wrap.top });
    }
  };

  const hasSel = !!selectedId || marked.length > 0;
  const hovered = hover ? SHAPE_BY_ID[hover.id] : null;
  const sorted = [...SHAPES].sort((a, b) => b.area - a.area); // kleine Kantone oben → klickbar

  return (
    <div
      ref={wrapRef}
      className={`swiss-map mode-${mode} ${hasSel ? "has-selection" : ""} ${interactive ? "is-interactive" : ""} ${ambient ? "is-ambient" : ""} ${className}`}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label={ariaLabel}
        tabIndex={interactive ? 0 : -1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <defs>
          <pattern id="p-lines" width="7" height="7" patternUnits="userSpaceOnUse">
            <path d="M0 3.5h7" stroke="#1d1a17" strokeOpacity=".22" strokeWidth="1" />
          </pattern>
          <pattern id="p-diag" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 4h8" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
          </pattern>
          <pattern id="p-dots" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.25" fill="#1d1a17" fillOpacity=".28" />
          </pattern>
          <pattern id="p-grid" width="9" height="9" patternUnits="userSpaceOnUse">
            <path d="M0 0h9M0 0v9" stroke="#fff" strokeOpacity=".45" strokeWidth="1" />
          </pattern>
          <pattern id="p-waves" width="16" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 4q4-4 8 0t8 0" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.2" />
          </pattern>
          <pattern id="p-rings" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.1" />
          </pattern>
          {/* mehrsprachige Kantone: Streifen in den Sprachfarben (nicht als geografische Aussage!) */}
          {SHAPES.filter((s) => s.canton.languages.length > 1).map((s) => {
            const langs = s.canton.languages;
            const w = 6 * langs.length;
            return (
              <pattern key={s.canton.id} id={`p-ml-${s.canton.id}`} width={w} height={w} patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
                {langs.map((l, i) => (
                  <rect key={l} x={i * 6} y="0" width="6" height={w} fill={`var(--lang-${l})`} />
                ))}
              </pattern>
            );
          })}
          <filter id="lift" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1d1a17" floodOpacity=".35" />
          </filter>
        </defs>

        <path className="country-shadow" d={COUNTRY_PATH} />

        <g className="cantons">
          {sorted.map((s) => {
            const c = s.canton;
            const sel = c.id === selectedId;
            const isMarked = marked.includes(c.id);
            const multi = c.languages.length > 1;
            const pat = PATTERN_OF[c.id] ?? PATTERNS[c.bfs % PATTERNS.length];
            const small = s.area < SMALL_AREA;
            const label = `${c.name} (${c.abbreviation}), Hauptort ${c.capital}`;
            return (
              <g
                key={c.id}
                className={`canton ${sel ? "is-selected" : ""} ${isMarked ? "is-marked" : ""}`}
                style={{ ["--c" as string]: c.color }}
                role={interactive ? "button" : undefined}
                tabIndex={interactive ? 0 : -1}
                aria-label={interactive ? label : undefined}
                aria-pressed={interactive ? sel : undefined}
                onClick={() => select(c.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(c.id);
                  }
                }}
                onPointerEnter={(e) => interactive && showHover(c.id, e)}
                onPointerMove={(e) => interactive && e.pointerType === "mouse" && showHover(c.id, e)}
                onPointerLeave={() => setHover(null)}
                onFocus={(e) => showHover(c.id, e)}
                onBlur={() => setHover(null)}
              >
                <path className="fill" d={s.d} />
                {mode === "art" && multi && <path className="multi" d={s.d} fill={`url(#p-ml-${c.id})`} />}
                {mode === "art" && <path className="texture" d={s.d} fill={`url(#p-${pat})`} />}
                {small && interactive && <circle className="hit" cx={s.centroid[0]} cy={s.centroid[1]} r={10} />}
              </g>
            );
          })}
        </g>

        <g className="lakes" aria-hidden="true">
          {LAKE_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <path className="borders" d={BORDERS_PATH} aria-hidden="true" />
        <path className="country-outline" d={COUNTRY_PATH} aria-hidden="true" />

        {selectedId && SHAPE_BY_ID[selectedId] && (
          <path className="selected-outline" d={SHAPE_BY_ID[selectedId].d} filter="url(#lift)" aria-hidden="true" />
        )}

        {mode === "wappen" && (
          <g className="wappen-layer" aria-hidden="true">
            {SHAPES.map((s) => {
              const base = Math.max(14, Math.min(34, Math.sqrt(s.area) * 0.28));
              return (
                <image
                  key={s.canton.id}
                  className="map-wappen"
                  href={assetUrl(s.canton.coatOfArms!)}
                  data-base={base}
                  data-cx={s.centroid[0]}
                  data-cy={s.centroid[1]}
                  x={s.centroid[0] - base / 2}
                  y={s.centroid[1] - base / 2}
                  width={base}
                  height={base}
                  style={{ imageRendering: "pixelated" }}
                />
              );
            })}
          </g>
        )}

        {mode === "geo" && (
          <g className="labels" aria-hidden="true">
            {SHAPES.map((s) => {
              const [x, y] = labelPoint(s);
              return (
                <text key={s.canton.id} x={x} y={y} className={s.area < SMALL_AREA ? "small" : ""}>
                  {s.canton.abbreviation}
                </text>
              );
            })}
          </g>
        )}

        {ambient && (
          <g className="ambient" aria-hidden="true">
            {SHAPES.map((s, i) => (
              <circle key={s.canton.id} cx={s.centroid[0]} cy={s.centroid[1]} r={4} style={{ animationDelay: `${(i * 0.37) % 4}s`, ["--c" as string]: s.canton.color }} />
            ))}
          </g>
        )}

        <g ref={rippleRef} className="ripples" aria-hidden="true" />
      </svg>

      {hovered && hover && (
        <div className="map-tip" style={{ left: hover.x, top: hover.y }} role="tooltip">
          {mode === "wappen" && (
            <img src={assetUrl(hovered.canton.coatOfArms!)} width={44} height={44} alt="" style={{ imageRendering: "pixelated" }} />
          )}
          <div>
            <strong>{hovered.canton.name}</strong>
            <span>
              {hovered.canton.abbreviation} · {hovered.canton.languages.map((l) => LANGUAGE_LABEL[l]).join(", ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
