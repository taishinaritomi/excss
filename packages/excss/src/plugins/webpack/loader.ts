import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { transform } from "@excss/compiler";
import type { LoaderContext, LoaderDefinitionFunction } from "webpack";
import { generateFileId } from "../../utils/generateFileId.ts";
import type { ExcssWebpackConfig } from "./plugin.ts";

type WebpackLoaderParams = Parameters<LoaderDefinitionFunction<never>>;

const virtualLoader = "excss/webpack/virtualLoader";
const virtualCSS = "excss/assets/ex.css";

export type LoaderOption = {
  config: () => ExcssWebpackConfig;
};

export default function excssLoader(
  this: LoaderContext<LoaderOption>,
  code: WebpackLoaderParams[0],
  map: WebpackLoaderParams[1],
) {
  try {
    const config = this.getOptions().config();

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
      inject: config.inject,
    });

    if (result.type === "Ok") {
      if (result.css) {
        for (const dependency of config.dependencies) {
          this.addDependency(dependency);
        }

        const importCode = createCSSImportCode(result.css, {
          context: this,
          fileId,
          cssOutDir: config.cssOutDir,
        });

        this.callback(undefined, `${result.code}\n${importCode}`);
      } else {
        this.callback(undefined, code, map);
      }
    } else {
      for (const dependency of config.dependencies) {
        this.addDependency(dependency);
      }

      this.callback(
        new Error(result.errors.map((err) => err.message).join("\n")),
        code,
        map,
      );
    }
  } catch (error) {
    this.callback(error as Error, code, map);
  }
}

type CreateCSSImportCodeOption = {
  context: LoaderContext<unknown>;
  fileId: string;
  cssOutDir?: string | undefined;
};

function createCSSImportCode(
  src: string,
  { context, cssOutDir, fileId }: CreateCSSImportCodeOption,
) {
  if (cssOutDir) {
    if (!fs.existsSync(cssOutDir)) fs.mkdirSync(cssOutDir);
    const hash = createHash("sha256").update(fileId).digest("hex").slice(0, 8);
    const output = path.join(cssOutDir, `${hash}.css`);

    fs.writeFileSync(output, src);

    return `import ${JSON.stringify(
      path.posix.relative(context.context, output) + "?" + Date.now(),
    )};`;
  } else {
    const content = JSON.stringify({ src });

    return `import ${JSON.stringify(
      context.utils.contextify(
        context.context,
        `ex.css!=!${virtualLoader}?${content}!${virtualCSS}`,
      ),
    )};`;
  }
}
