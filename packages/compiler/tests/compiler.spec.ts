import { format } from "prettier";
import { describe, it, expect } from "vitest";
import { transform } from "../binding/wasm-node/excss_compiler";

describe("transform", () => {
  it("basic", async () => {
    const before = `
      import { css } from "excss";
      css\`color: red\`;
      function fn() { return css\`color: red\` };
      const className = css\`color: red\`;
    `;

    const result = transform(before, {
      filename: "index.ts",
      variants: {
        red: "red",
      },
    });

    if (result.type === "Err") throw new Error("transform error");

    const after = `
      import { css } from "excss";
      "eJbwPJ";
      function fn() { return "eJbwPJ" };
      const className = "eJbwPJ";
    `;

    const css = `.eJbwPJ{color:red;}`;

    expect(await format(result.code, { parser: "babel" })).equals(
      await format(after, { parser: "babel" }),
    );
    expect(await format(result.css, { parser: "css" })).equals(
      await format(css, { parser: "css" }),
    );
  });

  it("as import", async () => {
    const before = `
      import { css } from "excss";
      import { css as css2 } from "excss";
      import * as namespace from "excss";
      const className1 = css\`color: red\`;
      const className2 = css2\`color: blue\`;
      const className3 = namespace.css\`color: green\`;
    `;

    const result = transform(before, { filename: "index.ts", variants: {} });

    if (result.type === "Err") throw new Error("transform error");

    const after = `
      import { css } from "excss";
      import { css as css2 } from "excss";
      import * as namespace from "excss";
      const className1 = "eJbwPJ";
      const className2 = "kfMYJO";
      const className3 = "cfIbqU";
    `;

    const css = `
      .eJbwPJ{color:red;}
      .kfMYJO{color: blue;}
      .cfIbqU{color: green;}
    `;

    expect(await format(result.code, { parser: "babel" })).equals(
      await format(after, { parser: "babel" }),
    );
    expect(await format(result.css, { parser: "css" })).equals(
      await format(css, { parser: "css" }),
    );
  });

  it("media query & pseudo", async () => {
    const before = `
      import { css } from "excss";
      const className = css\`
        @media (max-width: 100px) {
          color: red;
          @media (max-width: 200px) {
            color: $blue;
          }
        }
        &:hover {
          color: green;
          &:focus {
            color: yellow;
          }
        }
      \`;
    `;

    const result = transform(before, {
      filename: "index.ts",
      variants: { blue: "blue" },
    });

    if (result.type === "Err") throw new Error("transform error");

    const after = `
      import { css } from "excss";
      const className = "czZJKS";
    `;

    const css = `

      @media (max-width: 100px) {
        .czZJKS { color: red; }
      }
      @media (max-width: 100px) and (max-width: 200px) {
        .czZJKS { color: blue; }
      }
      .czZJKS:hover{color:green;}
      .czZJKS:hover:focus{color:yellow;}
  `;

    expect(await format(result.code, { parser: "babel" })).equals(
      await format(after, { parser: "babel" }),
    );
    expect(await format(result.css, { parser: "css" })).equals(
      await format(css, { parser: "css" }),
    );
  });
});
