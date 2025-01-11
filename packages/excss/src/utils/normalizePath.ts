import { posix, win32 } from "node:path";

export function normalizePath(filename: string) {
  return filename.split(win32.sep).join(posix.sep);
}
