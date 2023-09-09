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
  inject?: string | undefined;
  /**
   * @default /\.(js|jsx|ts|tsx)$/
   */
  include?: FilterPattern | undefined;
  /**
   * @default undefined
   */
  exclude?: FilterPattern | undefined;
};

export function defineConfig(config?: Config) {
  return config;
}
