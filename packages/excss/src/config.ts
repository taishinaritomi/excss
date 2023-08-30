export type Variants = Record<string, string | number>;

export function variants(variants: Variants): string {
  return Object.entries(variants)
    .map(([key, value]) => `$${key}:${value};`)
    .join("");
}
