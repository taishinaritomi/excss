import fs from "node:fs";
import path from "node:path";
import type { Compiler } from "webpack";
import type { ExcssLoaderOption } from "./loader.ts";

export type ExcssOption = Omit<
  ExcssLoaderOption,
  "packageName" | "configDependencies"
>;

type PackageJson = {
  name?: string;
};

class ExcssPlugin {
  loaderOption: ExcssLoaderOption;
  packageJsonPath = path.join(process.cwd(), "package.json");

  constructor(option?: ExcssOption) {
    this.loaderOption = option ?? {};
  }

  getPackageName() {
    const file = fs.readFileSync(this.packageJsonPath);
    const packageJson = JSON.parse(file.toString()) as PackageJson;
    this.loaderOption.configDependencies = [this.packageJsonPath];
    return packageJson.name;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.beforeCompile.tap("excss:beforeCompile", (_params) => {
      const packageName = this.getPackageName();
      this.loaderOption.packageName = packageName;
    });

    compiler.hooks.watchRun.tap("excss:watchRun", (compilation) => {
      if (compilation.modifiedFiles?.has(this.packageJsonPath)) {
        const packageName = this.getPackageName();
        this.loaderOption.packageName = packageName;
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
