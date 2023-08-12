import React from "@vitejs/plugin-react";
import { ExcssVitePlugin } from "excss/vite";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
  build: {
    manifest: true,
    sourcemap: true,
  },
  plugins: [
    React(),
    ExcssVitePlugin({
      variants: {
        red: "#ff0000",
      },
      inject: `
        $breakpoints: (
          "_400": "screen and (max-width: 400px)",
          "_800": "screen and (max-width: 800px)",
          "_1000": "screen and (max-width: 1000px)",
        ) !default;

        @mixin mq($breakpoint) {
          @media #{map-get($breakpoints, $breakpoint)} {
              @content;
          }
        }
      `,
    }),
    Inspect({
      build: true,
      outputDir: ".inspect",
    }),
  ],
});
