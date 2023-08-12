import { describe, it, expect, expectTypeOf } from "vitest";
import type { Picker } from "./picker";
import { picker } from "./picker";

describe("picker", () => {
  it("basic", () => {
    const style = picker({
      base: "base",
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

    expect(style({ number: 1 })).equals("base number-1 is-true");

    type Style = {
      string?: "red" | "blue";
      number?: 0 | 1;
      boolean?: boolean;
    };

    expectTypeOf(style).toEqualTypeOf<(props: Style) => string>();
    expectTypeOf<Picker<typeof style>>().toEqualTypeOf<Style>();
  });
});
