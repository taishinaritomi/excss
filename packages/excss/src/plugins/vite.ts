import { transform } from "@excss/compiler";
import type * as Vite from "vite";
import { generateFileId } from "../utils/generateFileId.ts";
import type { ResolvedConfig } from "../utils/loadConfig.ts";
import { loadConfig } from "../utils/loadConfig.ts";

const VIRTUAL_MODULE_ID = "virtual:ex.css";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;
const CSS_PARAM_NAME = "css";

function plugin(): Vite.Plugin {
  let config: ResolvedConfig;

  return {
    name: "excss",

    async configResolved(viteConfig) {
      config = await loadConfig(viteConfig.root);

      for (const dependency of config.dependencies) {
        viteConfig.configFileDependencies.push(dependency);
      }
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
        return params.get(CSS_PARAM_NAME) ?? "";
      } else {
        return;
      }
    },

    transform(code, id, options) {
      const isSSR = options?.ssr ?? false;

      const [filename] = id.split("?");

      if (!filename) return;
      if (filename.includes("/node_modules/")) return;
      if (!config.filter(filename)) return;

      const fileId = generateFileId({
        root: config.root,
        filename,
        packageName: config.packageName,
      });

      const result = transform(code, {
        filename,
        fileId,
        helpers: config.helpers,
      });

      if (result.type === "Ok") {
        if (result.css) {
          if (isSSR) {
            return { code: result.code, map: result.map };
          } else {
            const params = new URLSearchParams({
              [CSS_PARAM_NAME]: result.css,
            });

            const importCSS = `import ${JSON.stringify(
              `${VIRTUAL_MODULE_ID}?${params.toString()}`,
            )};`;
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

export default plugin;
