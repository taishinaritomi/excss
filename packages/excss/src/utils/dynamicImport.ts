import { createRequire } from "node:module";

declare const require: NodeRequire;

export async function dynamicImport(
  file: string,
  isESM: boolean,
): Promise<unknown> {
  if (isESM) {
    return (await import(file)) as unknown;
  } else {
    const _require = __ESM__ ? createRequire(import.meta.url) : require;
    return _require(file) as unknown;
  }
}
