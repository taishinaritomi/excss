import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { Compiler } from "webpack";
import type { ResolvedConfig } from "../../utils/loadConfig.ts";
import { loadConfig } from "../../utils/loadConfig.ts";
import type { LoaderOptions } from "./loader.ts";

declare const require: NodeRequire;
const _require = __ESM__ ? createRequire(import.meta.url) : require;

export const CSS_PATH = (() => {
  const lastUpdate = path.join(
    // dist
    path.dirname(_require.resolve("excss")),
    "..",
    "assets",
    "ex.css",
  );
  if (!fs.existsSync(lastUpdate)) fs.writeFileSync(lastUpdate, "");
  return lastUpdate;
})();

export default class Plugin {
  private config: ResolvedConfig | undefined;
  watchMode = false;

  // constructor() {}

  getConfig() {
    if (this.config) return this.config;
    throw new Error("[excss internal error] config is not loaded");
  }

  async loadConfig(root: string) {
    const config = await loadConfig(root);
    this.config = config;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.run.tapPromise("excss:run", async (_) => {
      await this.loadConfig(compiler.context);
    });

    compiler.hooks.watchRun.tapPromise(
      "excss:watchRun",
      async (compilation) => {
        this.watchMode = true;
        if (this.config) {
          const isConfigChanged = this.config.dependencies
            .map((dependency) => compilation.modifiedFiles?.has(dependency))
            .includes(true);

          if (isConfigChanged) {
            await this.loadConfig(compiler.context);
          }
        } else {
          await this.loadConfig(compiler.context);
        }
      },
    );

    compiler.options.module.rules.push(
      {
        test: /\.(tsx|ts|js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "excss/webpack/loader",
            options: { plugin: this } satisfies LoaderOptions,
          },
        ],
      },
      {
        test: CSS_PATH,
        use: [
          {
            loader: "excss/webpack/cssLoader",
            options: { plugin: this } satisfies LoaderOptions,
          },
        ],
      },
    );
  }
}
