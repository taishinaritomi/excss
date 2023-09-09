import { transform } from "@excss/compiler";
import type * as Vite from "vite";
import type { Config } from "../config.ts";
import type { Filter } from "../utils/createFilter.ts";
import { createFilter } from "../utils/createFilter.ts";
import { generateFileId } from "../utils/generateFileId.ts";
import { loadConfig } from "../utils/loadConfig.ts";

const VIRTUAL_MODULE_ID = "virtual:ex.css";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

function plugin(): Vite.Plugin {
  let root: string;
  let config: Config;

  let filter: Filter;

  return {
    name: "excss",

    async configResolved(viteConfig) {
      root = viteConfig.root;

      const { config: _config, dependencies } = await loadConfig(
        viteConfig.root,
      );

      config = _config;

      filter = createFilter(config.include, config.exclude);

      for (const dependency of dependencies) {
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

      const fileId = generateFileId({
        root,
        filename,
        packageName: config.packageName ?? "unknown",
      });

      const result = transform(code, {
        filename,
        fileId,
        inject: config.inject,
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

export default plugin;
