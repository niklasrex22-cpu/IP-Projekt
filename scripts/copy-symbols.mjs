/**
 * Kopiert die Kantonssymbole (vereinfachte Wappen) aus dem npm-Paket
 * «ch-canton-symbols» (NZZ, CC BY-SA 4.0) nach public/assets/images/cantons/wappen/.
 * Aufruf: npm run symbols
 */
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const pkg = dirname(require.resolve("ch-canton-symbols/package.json"));
const src = join(pkg, "symbols", "13x13");
const dest = new URL("../public/assets/images/cantons/wappen/", import.meta.url);
mkdirSync(dest, { recursive: true });
let n = 0;
for (const f of readdirSync(src)) {
  if (f.endsWith(".svg") && f !== "ch.svg") {
    copyFileSync(join(src, f), new URL(f, dest));
    n++;
  }
}
copyFileSync(join(pkg, "LICENSE"), new URL("LICENSE-CC-BY-SA-4.0.txt", dest));
console.log("OK:", n, "Wappensymbole kopiert");
