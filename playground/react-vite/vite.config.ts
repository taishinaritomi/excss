import React from "@vitejs/plugin-react";
import { Excss } from "excss/vite";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
  build: {
    manifest: true,
    sourcemap: true,
  },
  plugins: [
    React(),
    Excss({
      variants: {
        red: "#ff0000",
      },
      inject: `
        $breakpoints: (
          400: "screen and (max-width: 400px)",
          800: "screen and (max-width: 800px)",
          1000: "screen and (max-width: 1000px)",
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
