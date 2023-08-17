import type { Compiler } from "webpack";
import type { ExcssLoaderOption } from "./loader";

export type ExcssOption = ExcssLoaderOption;

class ExcssPlugin {
  option: ExcssOption;
  constructor(option?: ExcssOption) {
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

export { ExcssPlugin };
