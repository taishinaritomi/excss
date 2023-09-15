import path from "node:path";
import { normalizePath } from "./normalizePath.ts";

type Option = {
  root: string;
  filename: string;
  packageName: string;
};

export function generateFileId(option: Option) {
  const relativePath = path.relative(option.root, option.filename);
  return `${option.packageName}+${normalizePath(relativePath)}`;
}
