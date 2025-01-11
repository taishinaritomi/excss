import fs from "node:fs";
import path from "node:path";

export function lookupFile(_dir: string, files: string[]): string | undefined {
  let dir = _dir;
  while (dir) {
    for (const file of files) {
      const filename = path.join(dir, file);
      if (isFile(filename)) return filename;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }

  return;
}

function isFile(filename: string) {
  return fs.statSync(filename, { throwIfNoEntry: false })?.isFile() ?? false;
}
