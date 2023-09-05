import fs from "node:fs";
import { PACKAGE_JSON } from "../constants.ts";
import { lookupFile } from "./lookupFile.ts";

type PackageJson = {
  name?: string;
  type?: "module" | "commonjs";
};

type Output = {
  path: string;
  data: PackageJson;
};

export function getPackageJson(dir: string): Output | undefined {
  const filename = lookupFile(dir, [PACKAGE_JSON]);
  return filename
    ? {
        path: filename,
        data: JSON.parse(
          fs.readFileSync(filename, "utf8").toString(),
        ) as PackageJson,
      }
    : undefined;
}
