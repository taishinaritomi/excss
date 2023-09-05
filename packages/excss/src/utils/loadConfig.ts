import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import * as esbuild from "esbuild";
import type { Config } from "../config.ts";
import { CONFIG_FILES } from "../constants.ts";
import { dynamicImport } from "./dynamicImport.ts";
import { generateHash } from "./generateHash.ts";
import { getIsESM } from "./getIsESM.ts";
import { getPackageJson } from "./getPackageJson.ts";
import { lookupFile } from "./lookupFile.ts";

export async function loadConfig(root: string) {
  const filename = lookupFile(root, CONFIG_FILES);

  let config: Config = {};
  let dependencies: string[] = [];

  if (filename) {
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

    if (code) {
      const hash = generateHash(code);
      const { dir, name } = path.parse(filename);
      const outputFilename = path.join(
        dir,
        `${name}.${hash}.${isESM ? "mjs" : "cjs"}`,
      );

      try {
        fs.writeFileSync(outputFilename, code);

        const module = (await dynamicImport(
          isESM ? url.pathToFileURL(outputFilename).href : outputFilename,
          isESM,
        )) as { default?: Config };

        if (module.default) config = module.default;
        dependencies = Object.keys(result.metafile.inputs).map((input) => {
          return path.resolve(root, input);
        });
      } finally {
        fs.rmSync(outputFilename);
      }
    }
  }

  if (config.packageName === undefined) {
    const packageJson = getPackageJson(root);
    if (packageJson) {
      config.packageName = packageJson.data.name;
      dependencies.push(packageJson.path);
    }
  }

  return {
    config,
    dependencies,
  };
}
