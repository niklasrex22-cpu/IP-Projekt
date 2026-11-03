type Name =
  | "play"
  | "stop"
  | "sound"
  | "mute"
  | "menu"
  | "close"
  | "reset"
  | "plus"
  | "minus"
  | "arrow"
  | "mic"
  | "upload"
  | "wave"
  | "rhythm"
  | "compare"
  | "check"
  | "x";

const PATHS: Record<Name, string> = {
  play: "M8 5.5v13l11-6.5z",
  stop: "M7 7h10v10H7z",
  sound: "M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z",
  mute: "M4 9v6h4l5 4V5L8 9H4zm12.6 3l2.9-2.9-1.4-1.4-2.9 2.9-2.9-2.9-1.4 1.4 2.9 2.9-2.9 2.9 1.4 1.4 2.9-2.9 2.9 2.9 1.4-1.4z",
  menu: "M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z",
  close: "M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z",
  reset: "M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z",
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z",
  minus: "M5 11h14v2H5z",
  arrow: "M13.2 5.3 11.8 6.7l4.3 4.3H4v2h12.1l-4.3 4.3 1.4 1.4L20 12z",
  mic: "M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9h-2z",
  upload: "M11 16h2V8.8l3.3 3.3 1.4-1.4L12 5 6.3 10.7l1.4 1.4L11 8.8zM5 18h14v2H5z",
  wave: "M2 12h2l2-6 3 12 3-15 3 15 3-9 2 3h2",
  rhythm: "M5 4v16M10 9v6M15 6v12M20 10v4",
  compare: "M9 3H4v18h5v-2H6V5h3zm6 0v2h3v14h-3v2h5V3zM11 1h2v22h-2z",
  check: "M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.5 8l-1.4-1.4z",
  x: "M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z",
};

const STROKE: Name[] = ["wave", "rhythm"];

export function Icon({ name, size = 20 }: { name: Name; size?: number }) {
  const stroke = STROKE.includes(name);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={PATHS[name]}
        fill={stroke ? "none" : "currentColor"}
        stroke={stroke ? "currentColor" : "none"}
        strokeWidth={stroke ? 2 : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
