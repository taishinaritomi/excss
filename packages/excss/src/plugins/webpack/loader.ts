import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { transform } from "@excss/compiler";
import type { Variants } from "@excss/compiler";
import type { LoaderContext, LoaderDefinitionFunction } from "webpack";

type WebpackLoaderParams = Parameters<LoaderDefinitionFunction<never>>;

const virtualLoader = "excss/webpack/virtualLoader";
const virtualCSS = "excss/assets/ex.css";

export type ExcssLoaderOption = {
  cssOutDir?: string | undefined;
  variants?: Variants | undefined;
  inject?: string | undefined;
};

function excssLoader(
  this: LoaderContext<ExcssLoaderOption>,
  code: WebpackLoaderParams[0],
  map: WebpackLoaderParams[1],
) {
  const option = this.getOptions();
  try {
    const result = transform(code, {
      filename: this.resourcePath,
      variants: option.variants,
      inject: option.inject,
    });
    if (result.type === "Ok") {
      if (result.css) {
        const importCode = createCSSImportCode(result.css, {
          context: this,
          cssOutDir: option.cssOutDir,
        });
        this.callback(undefined, `${result.code}\n${importCode}`);
      } else {
        this.callback(undefined, code, map);
      }
    } else {
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
  cssOutDir?: string | undefined;
};

function createCSSImportCode(
  src: string,
  { context, cssOutDir }: CreateCSSImportCodeOption,
) {
  if (cssOutDir) {
    if (!fs.existsSync(cssOutDir)) fs.mkdirSync(cssOutDir);
    const hash = createHash("md5").update(src).digest("hex");
    const srcPath = path.posix.join(cssOutDir, `${hash}.css`);
    fs.writeFileSync(srcPath, src);
    return `import "${srcPath}";`;
  } else {
    const content = JSON.stringify({ src });

    return `import ${JSON.stringify(
      context.utils.contextify(
        context.context || context.rootContext,
        `ex.css!=!${virtualLoader}?${content}!${virtualCSS}`,
      ),
    )};`;
  }
}

export default excssLoader;
