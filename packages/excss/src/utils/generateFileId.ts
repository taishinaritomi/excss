import path from "node:path";

type Option = {
  root: string;
  filename: string;
  packageName: string;
};

export function generateFileId(option: Option) {
  const relativePath = path.relative(option.root, option.filename);
  return `${option.packageName}+${relativePath}`;
}
