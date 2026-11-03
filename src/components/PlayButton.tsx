import { audio, usePlayback } from "../audio/engine";
import { Icon } from "./Icon";

/**
 * Einheitlicher Play/Stopp-Knopf. `onPlay` startet die Quelle (immer nach Benutzeraktion).
 */
export function PlayButton({
  sourceId,
  onPlay,
  label,
  disabled,
  variant = "accent",
  size,
}: {
  sourceId: string;
  onPlay: () => void;
  label: string;
  disabled?: boolean;
  variant?: "accent" | "ghost" | "ink";
  size?: "sm" | "big";
}) {
  const pb = usePlayback();
  const active = pb.playing && pb.sourceId === sourceId;
  return (
    <button
      type="button"
      className={`btn ${variant === "ink" ? "" : variant} ${size ?? ""}`}
      aria-pressed={active}
      disabled={disabled}
      onClick={() => (active ? audio.stop() : onPlay())}
    >
      <Icon name={active ? "stop" : "play"} size={size === "sm" ? 16 : 20} />
      <span>{active ? "Stopp" : label}</span>
    </button>
  );
}
