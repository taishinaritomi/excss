import React from "@vitejs/plugin-react-swc";
import Excss from "excss/vite";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
  build: {
    manifest: true,
    sourcemap: true,
  },
  plugins: [
    React(),
    Excss(),
    Inspect({
      build: true,
      outputDir: ".inspect",
    }),
  ],
});
