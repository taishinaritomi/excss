import path from "node:path";
import { getPackageJson } from "./getPackageJson.ts";

export function getIsESM(filename: string) {
  const { dir, ext } = path.parse(filename);

  if (/^\.m[jt]s$/.test(ext)) return true;
  else if (/^\.c[jt]s$/.test(ext)) return false;

  const packageJson = getPackageJson(dir);

  if (packageJson?.data.type === "module") return true;

  return false;
}
