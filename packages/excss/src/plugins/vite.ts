import fs from "node:fs";
import path from "node:path";
import { transform } from "@excss/compiler";
import type * as Vite from "vite";
import * as vite from "vite";
import { generateFileId } from "../utils/generateFileId.ts";

export { excss, excss as Excss };

const DEFAULT_INCLUDE = /\.(js|jsx|ts|tsx)$/;

const VIRTUAL_MODULE_ID = "virtual:ex.css";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

type ExcssOption = {
  /**
   * @default /\.(js|jsx|ts|tsx)$/
   */
  include?: Vite.FilterPattern | undefined;
  /**
   * @default undefined
   */
  exclude?: Vite.FilterPattern | undefined;
  /**
   * @default undefined
   */
  inject?: string | undefined;
};

function excss(option?: ExcssOption): Vite.Plugin {
  const filter = vite.createFilter(
    option?.include ?? DEFAULT_INCLUDE,
    option?.exclude,
  );

  let root: string;
  let packageName: string;

  return {
    name: "excss",

    configResolved(viteConfig) {
      root = viteConfig.root;
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(root, "package.json")).toString(),
      ) as { name?: string };

      viteConfig.configFileDependencies.push("package.json");
      packageName = packageJson.name ?? "unknown";
    },

    resolveId(id) {
      const [filename, params] = id.split("?");
      return filename === VIRTUAL_MODULE_ID
        ? `${RESOLVED_VIRTUAL_MODULE_ID}?${params}`
        : undefined;
    },

    load(id) {
      const [filename, _params] = id.split("?");
      if (filename === RESOLVED_VIRTUAL_MODULE_ID) {
        const params = new URLSearchParams(_params);
        return params.get("css") ?? "";
      } else {
        return;
      }
    },

    transform(code, id, options) {
      const isSSR = options?.ssr ?? false;

      const [filename] = id.split("?");

      if (!filename) return;
      if (filename.includes("/node_modules/")) return;
      if (!filter(filename)) return;

      const fileId = generateFileId({ root, filename, packageName });

      const result = transform(code, {
        filename,
        fileId,
        inject: option?.inject,
      });

      if (result.type === "Ok") {
        if (result.css) {
          if (isSSR) {
            return { code: result.code, map: result.map };
          } else {
            const fileParams = new URLSearchParams();
            fileParams.append("css", result.css);
            const virtualModule = `${VIRTUAL_MODULE_ID}?${fileParams.toString()}`;
            const importCSS = `import "${virtualModule}";`;
            return {
              code: `${result.code}\n${importCSS}`,
              map: result.map,
            };
          }
        } else {
          return;
        }
      } else {
        throw new Error(result.errors.map((err) => err.message).join("\n"));
      }
    },
  };
}
