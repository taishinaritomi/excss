import fs from "node:fs";
import path from "node:path";
import type { Compiler } from "webpack";
import type { ExcssLoaderOption } from "./loader.ts";

export type ExcssOption = Omit<
  ExcssLoaderOption,
  "root" | "packageName" | "configDependencies"
>;

type PackageJson = {
  name?: string;
};

class ExcssPlugin {
  loaderOption: ExcssLoaderOption;
  packageJsonPath = path.join(process.cwd(), "package.json");

  constructor(option?: ExcssOption) {
    this.loaderOption = {
      ...option,
      packageName: this.getPackageName(),
      root: process.cwd(),
      configDependencies: [this.packageJsonPath],
    };
  }

  getPackageName() {
    const file = fs.readFileSync(this.packageJsonPath);
    const packageJson = JSON.parse(file.toString()) as PackageJson;
    return packageJson.name ?? "unknown";
  }

  apply(compiler: Compiler): void {
    this.loaderOption.root = compiler.context;

    compiler.hooks.watchRun.tap("excss:watchRun", (compilation) => {
      if (compilation.modifiedFiles?.has(this.packageJsonPath)) {
        this.loaderOption.packageName = this.getPackageName();
      }
    });

    compiler.options.module.rules.push({
      test: /\.(tsx|ts|js|mjs|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "excss/webpack/loader",
          options: this.loaderOption,
        },
      ],
    });
  }
}

export { ExcssPlugin };
