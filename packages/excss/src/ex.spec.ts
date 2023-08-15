import { describe, it, expect, expectTypeOf } from "vitest";
import type { Ex } from "./ex";
import { ex } from "./ex";

describe("ex", () => {
  it("basic", () => {
    const style = ex({
      default: { boolean: true },
      string: {
        red: "string-red",
        blue: "string-blue",
      },
      number: {
        0: "number-0",
        1: "number-1",
      },
      boolean: {
        true: "is-true",
        false: "is-false",
      },
    });

    expect(style({ number: 1 })).equals("number-1 is-true");

    type Style = {
      string?: "red" | "blue";
      number?: 0 | 1;
      boolean?: boolean;
    };

    expectTypeOf(style).toEqualTypeOf<(props: Style) => string>();
    expectTypeOf<Ex<typeof style>>().toEqualTypeOf<Style>();
  });
});
