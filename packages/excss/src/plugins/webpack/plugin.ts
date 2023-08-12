import type { Compiler } from "webpack";
import type { ExcssWebpackLoaderOption } from "./loader";

export type ExcssWebpackPluginOption = ExcssWebpackLoaderOption;

export class ExcssWebpackPlugin {
  option: ExcssWebpackPluginOption;
  constructor(option?: ExcssWebpackPluginOption) {
    this.option = option ?? {};
  }
  apply(compiler: Compiler): void {
    compiler.options.module.rules.push({
      test: /\.(tsx|ts|js|mjs|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "excss/webpack/loader",
          options: this.option,
        },
      ],
    });
  }
}
