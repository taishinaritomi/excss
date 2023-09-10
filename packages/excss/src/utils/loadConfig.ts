import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import * as esbuild from "esbuild";
import type { Config } from "../config.ts";
import { CONFIG_FILES, DEFAULT_INCLUDE } from "../constants.ts";
import { createFilter, type Filter } from "./createFilter.ts";
import { dynamicImport } from "./dynamicImport.ts";
import { getIsESM } from "./getIsESM.ts";
import { getPackageJson } from "./getPackageJson.ts";
import { lookupFile } from "./lookupFile.ts";

export type ResolvedConfig = {
  root: string;
  packageName: string;
  filter: Filter;
  inject?: string | undefined;
  dependencies: string[];
};

export async function loadConfig(root: string): Promise<ResolvedConfig> {
  const filename = lookupFile(root, CONFIG_FILES);

  let config: Config | undefined;

  let dependencies: string[] = [];

  if (filename) {
    try {
      dependencies.push(filename);

      const isESM = getIsESM(filename);
      const result = await esbuild.build({
        absWorkingDir: root,
        entryPoints: [filename],
        outfile: "excss.js",
        write: false,
        bundle: true,
        packages: "external",
        format: isESM ? "esm" : "cjs",
        platform: "node",
        sourcemap: "inline",
        metafile: true,
      });

      const code = result.outputFiles[0]?.text ?? "";

      dependencies = Object.keys(result.metafile.inputs).map((input) => {
        return path.resolve(root, input);
      });

      if (code) {
        const { dir, name } = path.parse(filename);
        const outputFilename = path.join(
          dir,
          `${name}.${Date.now()}.${isESM ? "mjs" : "cjs"}`,
        );

        try {
          fs.writeFileSync(outputFilename, code);
          const module = (await dynamicImport(
            isESM ? url.pathToFileURL(outputFilename).href : outputFilename,
            isESM,
          )) as { default?: Config };

          if (module.default) config = module.default;
        } finally {
          fs.rmSync(outputFilename);
        }
      }
    } catch {
      /* empty */
    }
  }

  let packageName = config?.packageName ?? "unknown";

  try {
    if (config && config.packageName === undefined) {
      const result = getPackageJson(root);
      if (result?.packageJson.name) {
        packageName = result.packageJson.name;
        dependencies.push(result.filename);
      }
    }
  } catch {
    /* empty */
  }

  return {
    root,
    packageName,
    filter: createFilter(config?.include ?? DEFAULT_INCLUDE, config?.exclude),
    inject: config?.inject,
    dependencies,
  };
}
