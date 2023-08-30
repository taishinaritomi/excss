import { describe, expect, it } from "vitest";
import { variants } from "./config.ts";

describe("variants", () => {
  it("basic", () => {
    expect(
      variants({
        color_red: "red",
        space_sm: 12,
      }),
    ).equals("$color_red:red;$space_sm:12;");
  });
});
