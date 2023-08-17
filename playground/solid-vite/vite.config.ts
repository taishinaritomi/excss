import { Excss } from "excss/vite";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import Solid from "vite-plugin-solid";

export default defineConfig({
  build: {
    manifest: true,
    sourcemap: true,
  },
  plugins: [
    Solid(),
    Excss(),
    Inspect({
      build: true,
      outputDir: ".inspect",
    }),
  ],
});
