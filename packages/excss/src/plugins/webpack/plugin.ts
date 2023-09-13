import type { Compiler } from "webpack";
import type { ResolvedConfig } from "../../utils/loadConfig.ts";
import { loadConfig } from "../../utils/loadConfig.ts";
import type { LoaderOption } from "./loader.ts";

export default class Plugin {
  _config: ResolvedConfig | undefined;

  // constructor() {}

  async loadConfig(root: string) {
    const config = await loadConfig(root);
    this._config = config;
  }

  config() {
    if (this._config) return this._config;
    throw new Error("configuration not initialized or undefined.");
  }

  apply(compiler: Compiler): void {
    compiler.hooks.run.tapPromise("excss:run", async (_) => {
      await this.loadConfig(compiler.context);
    });

    compiler.hooks.watchRun.tapPromise(
      "excss:watchRun",
      async (compilation) => {
        if (this._config) {
          const isConfigChanged = this._config.dependencies
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
            options: {
              config: this.config.bind(this),
            } satisfies LoaderOption,
          },
        ],
      },
      {
        test: /ex\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "excss/webpack/cssLoader",
            options: {
              config: this.config.bind(this),
            } satisfies LoaderOption,
          },
        ],
      },
    );
  }
}
