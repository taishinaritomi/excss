import type { FilterPattern } from "./utils/createFilter.ts";

export type Variants = Record<string, string | number>;

export function variants(variants: Variants): string {
  return Object.entries(variants)
    .map(([key, value]) => `$${key}:${value};`)
    .join("");
}

export type Config = {
  /**
   * @default `packge.json` name property
   */
  packageName?: string | undefined;
  /**
   * @default undefined
   */
  helper?: string | undefined;
  /**
   * @default /\.(js|jsx|ts|tsx)$/
   * @description Specifies a RegExp pattern or list of RegExp patterns to match files to be included in the compilation.
   */
  include?: FilterPattern | undefined;
  /**
   * @default undefined
   * @description Specifies a RegExp pattern or list of RegExp patterns to identify files to be excluded from the compilation."
   *
   */
  exclude?: FilterPattern | undefined;
};

export function defineConfig(config?: Config) {
  return config;
}
