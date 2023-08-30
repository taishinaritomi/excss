import { describe, expect, it } from "vitest";
import { generateFileId } from "./generateFileId.ts";

describe("generateFileId", () => {
  it("basic", () => {
    expect(
      generateFileId({
        root: "/path/to/root",
        filename: "/path/to/root/src/filename.ts",
        packageName: "package_name",
      }),
    ).equals("package_name+src/filename.ts");
  });
});
