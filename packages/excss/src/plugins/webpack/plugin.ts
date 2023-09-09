import type { Compiler } from "webpack";
import type { Filter } from "../../utils/createFilter.ts";
import { createFilter } from "../../utils/createFilter.ts";
import { loadConfig } from "../../utils/loadConfig.ts";
import type { LoaderOption } from "./loader.ts";

type PluginOption = {
  /**
   * @default undefined
   */
  cssOutDir?: string | undefined;
};

export type Config = {
  root: string;
  cssOutDir?: string | undefined;
  configDependencies: string[];
  packageName: string;
  filter: Filter;
  inject?: string | undefined;
};

export default class Plugin {
  pluginOption: PluginOption;
  config: Config | undefined;

  constructor(option?: PluginOption) {
    this.pluginOption = option ?? {};
  }

  async loadConfig(root: string) {
    const { config, dependencies } = await loadConfig(root);
    this.config = {
      root,
      configDependencies: dependencies,
      cssOutDir: this.pluginOption.cssOutDir,
      packageName: config.packageName ?? "unknown",
      inject: config.inject,
      filter: createFilter(config.include, config.exclude),
    };
  }

  loaderLoadConfig() {
    if (this.config) return this.config;
    throw new Error("panic");
  }

  apply(compiler: Compiler): void {
    let isInit = true;
    compiler.hooks.beforeCompile.tapPromise(
      "excss:beforeCompile",
      async (_) => {
        if (isInit) {
          await this.loadConfig(compiler.context);
          isInit = false;
        }
      },
    );

    compiler.hooks.watchRun.tapPromise(
      "excss:beforeCompile",
      async (compilation) => {
        const isLoadConfig = this.config?.configDependencies
          .map((dependency) => {
            return compilation.modifiedFiles?.has(dependency);
          })
          .includes(true);

        if (isLoadConfig) {
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
            loadConfig: this.loaderLoadConfig.bind(this),
          } satisfies LoaderOption,
        },
      ],
    });
  }
}
