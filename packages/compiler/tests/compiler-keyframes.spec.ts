import { format } from "prettier";
import { describe, expect, it } from "vitest";
import { transform } from "../binding/wasm-node/excss_compiler.js";

describe("transform", () => {
  it("basic", async () => {
    const before = `
      import { keyframes } from "excss";
      keyframes\`from { color: red } to { color: blue }\`;
      function fn() { return  keyframes\`from { color: red } to { color: blue }\`; };
      const keyframes =  keyframes\`from { color: red } to { color: blue }\`;
    `;

    const result = transform(before, {
      filename: "index.ts",
      helper: `
        $red: red;
      `,
    });

    if (result.type === "Err") throw new Error("transform error");

    const after = `
      import { keyframes } from "excss";
      ("dmfCDo");
      function fn() { return "dmfCDo" };
      const keyframes = "dmfCDo";
    `;

    const css =
      "@keyframes dmfCDo { from { color: red; } to { color: blue; } }";

    expect(await format(result.code, { parser: "babel" })).equals(
      await format(after, { parser: "babel" }),
    );
    expect(await format(result.css, { parser: "css" })).equals(
      await format(css, { parser: "css" }),
    );
  });

  it("as import", async () => {
    const before = `
      import { keyframes } from "excss";
      import { keyframes as keyframes2 } from "excss";
      import * as namespace from "excss";
      const className1 = keyframes\`from { color: red } to { color: blue }\`;
      const className2 = keyframes2\`from { color: blue } to { color: red }\`;
      const className3 = namespace.keyframes\`from { color: blue } to { color: green }\`;
    `;

    const result = transform(before, { filename: "index.ts" });

    if (result.type === "Err") throw new Error("transform error");

    const after = `
      import { keyframes } from "excss";
      import { keyframes as keyframes2 } from "excss";
      import * as namespace from "excss";
      const className1 = "dmfCDo";
      const className2 = "GKhiH";
      const className3 = "eJTovi";
    `;

    const css = `
      @keyframes dmfCDo {
        from { color: red; }
        to { color: blue; }
      }
      @keyframes GKhiH {
        from { color: blue; }
        to { color: red; }
      }
      @keyframes eJTovi {
        from { color: blue; }
        to { color: green; }
      }
    `;

    expect(await format(result.code, { parser: "babel" })).equals(
      await format(after, { parser: "babel" }),
    );
    expect(await format(result.css, { parser: "css" })).equals(
      await format(css, { parser: "css" }),
    );
  });
});
