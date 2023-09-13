import fs from "node:fs";
import { PACKAGE_JSON } from "../constants.ts";
import { lookupFile } from "./lookupFile.ts";

type PackageJson = {
  name?: string;
  type?: "module" | "commonjs";
};

type Result = {
  filename: string;
  packageJson: PackageJson;
};

export function getPackageJson(dir: string): Result | undefined {
  const filename = lookupFile(dir, [PACKAGE_JSON]);
  return filename
    ? {
        filename,
        packageJson: JSON.parse(
          fs.readFileSync(filename, "utf8").toString(),
        ) as PackageJson,
      }
    : undefined;
}
