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
        true: "boolean-true",
        false: "boolean-false",
      },
    });

    expect(style({ number: 1, boolean: undefined })).equals(
      "number-1 boolean-true",
    );

    expectTypeOf(style).toEqualTypeOf<
      (props?: {
        string?: "red" | "blue";
        number?: 0 | 1;
        boolean?: boolean;
      }) => string
    >();

    /// Ex

    expectTypeOf<Ex<typeof style>>().toEqualTypeOf<{
      string?: "red" | "blue";
      number?: 0 | 1;
      boolean?: boolean;
    }>();

    /// Ex.Required

    expectTypeOf<Ex.Required<typeof style>>().toEqualTypeOf<{
      string: "red" | "blue";
      number: 0 | 1;
      boolean: boolean;
    }>();

    expectTypeOf<
      Ex.Required<typeof style, "string" | "number">
    >().toEqualTypeOf<{
      string?: "red" | "blue";
      number?: 0 | 1;
      boolean: boolean;
    }>();

    expectTypeOf<Ex.Required<Ex<typeof style>>>().toEqualTypeOf<{
      string: "red" | "blue";
      number: 0 | 1;
      boolean: boolean;
    }>();

    /// Ex.Optional

    expectTypeOf<Ex.Optional<typeof style>>().toEqualTypeOf<{
      string?: "red" | "blue";
      number?: 0 | 1;
      boolean?: boolean;
    }>();

    expectTypeOf<
      Ex.Optional<typeof style, "string" | "number">
    >().toEqualTypeOf<{
      string: "red" | "blue";
      number: 0 | 1;
      boolean?: boolean;
    }>();

    expectTypeOf<Ex.Optional<Ex<typeof style>>>().toEqualTypeOf<{
      string?: "red" | "blue";
      number?: 0 | 1;
      boolean?: boolean;
    }>();
  });
});
