import fs from "node:fs";
import { transform } from "@excss/compiler";
import type { LoaderContext, LoaderDefinitionFunction } from "webpack";
import { generateFileId } from "../../utils/generateFileId.ts";
import type Plugin from "./plugin.ts";
import { CSS_PATH } from "./plugin.ts";

type WebpackLoaderParams = Parameters<LoaderDefinitionFunction<never>>;

export type LoaderOptions = {
  plugin: Plugin;
};

export default function loader(
  this: LoaderContext<LoaderOptions>,
  code: WebpackLoaderParams[0],
  map: WebpackLoaderParams[1],
) {
  try {
    const { plugin } = this.getOptions();
    const config = plugin.getConfig();

    if (!config.filter(this.resourcePath)) {
      this.callback(undefined, code, map);

      for (const dependency of config.dependencies) {
        this.addDependency(dependency);
      }
      return;
    }

    const fileId = generateFileId({
      root: config.root,
      filename: this.resourcePath,
      packageName: config.packageName,
    });

    const result = transform(code, {
      filename: this.resourcePath,
      fileId,
      helper: config.helper,
    });

    if (result.type === "Ok") {
      if (result.css) {
        for (const dependency of config.dependencies) {
          this.addDependency(dependency);
        }

        const params = new URLSearchParams({ css: result.css });

        const importCSS = `import ${JSON.stringify(
          `${this.utils.contextify(
            this.context,
            CSS_PATH,
          )}?${params.toString()}`,
        )};`;

        if (plugin.watchMode) {
          fs.writeFileSync(CSS_PATH, `/* ${Date.now()} */`);
        }

        this.callback(undefined, `${result.code}\n${importCSS}`);
      } else {
        this.callback(undefined, code, map);
      }
    } else {
      for (const dependency of config.dependencies) {
        this.addDependency(dependency);
      }

      this.callback(
        new Error(result.errors.map((err) => err.message).join("\n")),
      );
    }
  } catch (error) {
    this.callback(error as Error);
  }
}
