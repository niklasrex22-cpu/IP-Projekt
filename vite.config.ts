import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" erlaubt das Hosten in einem Unterordner (z. B. GitHub Pages oder Schulserver).
export default defineConfig({
  plugins: [react()],
  base: "./",
  // Die Kartengeometrie (~210 KB) ist bewusst im Bundle, damit die Karte offline sofort erscheint.
  build: { chunkSizeWarningLimit: 800 },
});
