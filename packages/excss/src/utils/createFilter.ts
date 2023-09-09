import { win32, posix } from "node:path";

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (Array.isArray(value)) return value;
  return value === undefined ? [] : [value];
}

function normalizePath(filename: string) {
  return filename.split(win32.sep).join(posix.sep);
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
