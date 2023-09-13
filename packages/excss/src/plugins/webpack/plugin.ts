import type { Compiler } from "webpack";
import type { ResolvedConfig } from "../../utils/loadConfig.ts";
import { loadConfig } from "../../utils/loadConfig.ts";
import type { LoaderOption } from "./loader.ts";

type PluginOption = {
  /**
   * @default undefined
   */
  cssOutDir?: string | undefined;
};

export type ExcssWebpackConfig = ResolvedConfig & {
  cssOutDir?: string | undefined;
};

export default class Plugin {
  pluginOption: PluginOption;
  _config: ExcssWebpackConfig | undefined;

  constructor(option?: PluginOption) {
    this.pluginOption = option ?? {};
  }

  async loadConfig(root: string) {
    const config = await loadConfig(root);
    this._config = {
      cssOutDir: this.pluginOption.cssOutDir,
      ...config,
    };
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

    compiler.options.module.rules.push({
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
    });
  }
}
