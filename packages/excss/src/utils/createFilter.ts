import { normalizePath } from "./normalizePath.ts";

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (Array.isArray(value)) return value;
  return value === undefined ? [] : [value];
}

export type FilterPattern = RegExp | RegExp[];
export type Filter = (filename: string) => boolean;

export function createFilter(
  include?: FilterPattern | undefined,
  exclude?: FilterPattern | undefined,
): Filter {
  const includes = ensureArray(include);
  const excludes = ensureArray(exclude);

  return (filename: string): boolean => {
    filename = normalizePath(filename);

    for (const matcher of excludes) {
      if (matcher.test(filename)) return false;
    }

    for (const matcher of includes) {
      if (matcher.test(filename)) return true;
    }

    return includes.length === 0;
  };
}
