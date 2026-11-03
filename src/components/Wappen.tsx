import type { Canton } from "../data/types";
import { assetUrl } from "../lib/hooks";

/** Kantonswappen-Symbol (NZZ ch-canton-symbols, CC BY-SA 4.0). */
export function Wappen({ canton, size = 48, className = "" }: { canton: Canton; size?: number; className?: string }) {
  if (!canton.coatOfArms) return null;
  return (
    <img
      className={`wappen ${className}`}
      src={assetUrl(canton.coatOfArms)}
      width={size}
      height={size}
      alt={`Wappensymbol ${canton.name}`}
      loading="lazy"
      decoding="async"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
