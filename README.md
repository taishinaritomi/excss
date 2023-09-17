# excss

excss is a small, simple, zero-runtime CSS-in-JS library with just two APIs.

```ts
import { css, ex, FILE_ID } from "excss";
import type { Ex } from "excss";
import { useState } from "react";

const button = ex({
  color: {
    red: css`
      color: red;
    `,
    green: css`
      color: green;
    `,
    blue: css`
      color: blue;
    `,
  },
});

type Props = {
  buttonStyle: Ex<typeof button>;
};

export function Component(props: Props) {
  const [rotate] = useState(0);
  const [isDisabled] = useState(false);
  return (
    <div
      style={{ [`--${FILE_ID}-rotate`]: `${rotate}deg` }}
      className={ex.join(
        css`
          transform: rotate(var(--#{$FILE_ID}-rotate));
          $animation-spin: unique();
          animation: $animation_spin 0.5s;

          @keyframes #{$animation-spin} {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `,
        css`
          color: $primary;
          gap: $space_sm;
        `,
        !isDisabled &&
          css`
            @include mediaQuery(sm) {
              background-color: black;
            }

            @media screen and (max-width: $sm) {
              background-color: black;
            }

            &:hover {
              background-color: green;
            }
          `,
      )}
    >
      <button className={button(props.buttonStyle)}>Button</button>
    </div>
  );
}
```

## Setups

Install excss.

`npm i excss` `pnpm i excss` `yarn add excss`

Setting up the compiler based on the bundler.

```js
// next.config.mjs
import createExcss from "excss/next";

const withExcss = createExcss();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withExcss(nextConfig);
```

```ts
// vite.config.ts
import Excss from "excss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [Excss()],
});
```

```js
// webpack.config.mjs
import ExcssPlugin from "excss/webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default {
  // webpack options
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [new ExcssPlugin(), new MiniCssExtractPlugin()],
};
```

## excss.config.ts

```ts
// excss.config.ts
import { defineConfig, variants } from "excss/config";

export default defineConfig({
  include: /\.(ts|tsx)$/,
  helper: `
    ${variants({
      primary: "red",
    })}
  `,
});
```
