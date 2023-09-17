# @excss/compiler

## 0.1.1

### Patch Changes

- [#51](https://github.com/taishinaritomi/excss/pull/51) [`3fbe77b`](https://github.com/taishinaritomi/excss/commit/3fbe77b2aef699108519e69fdfec316e66d14b48) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - chore: due to the failure of the 0.1.0 npm release

  ## refactor: rename inject to helper

  ```diff
  // excss.config.ts
  import { defineConfig } from "excss/config";

  export default defineConfig({
  -  inject: ``,
  +  helper: ``,
  });
  ```

  ### feat: support for excss.config.ts

  #### vite.config.ts

  In the updated configuration, we have simplified the excss plugin initialization in `vite.config.ts`. Similar changes are also implemented in Next.js and webpack.

  ```diff
  import Excss from "excss/vite";
  import { defineConfig } from "vite";

  export default defineConfig({
    plugins: [
  +    Excss(),
  -    Excss({
  -      inject: ``,
  -    }),
    ],
  });
  ```

  #### excss.config.ts

  A new file `excss.config.ts` has been introduced to house the excess configuration settings, which includes the `helper` option.

  ```diff
  +import { defineConfig } from "excss/config";
  +
  +export default defineConfig({
  +  helper: ``,
  +});
  ```

  ### feat: integrated variants field into inject field

  ```diff
  +import { variants } from "excss/config";

  {
  - variants: {
  -   red: "#ff0000",
  - },
    helper: `
  +   ${variants({
  +     red: "#ff0000",
  +   })}
      $breakpoints: (
        400: "screen and (max-width: 400px)",
        800: "screen and (max-width: 800px)",
        1000: "screen and (max-width: 1000px)",
      ) !default;

      @mixin mq($breakpoint) {
        @media #{map-get($breakpoints, $breakpoint)} {
            @content;
        }
      }
    `,
  }
  ```

  ### feat: change export method for plugins from named export to default export

  ```diff
  -import { Excss } from "excss/vite";
  +import Excss from "excss/vite";

  -import { ExcssPlugin } from "excss/webpack";
  +import ExcssPlugin from "excss/webpack";

  -import { createExcss } from "excss/next";
  +import createExcss from "excss/next";
  ```

## 0.1.0

### Minor Changes

- [#48](https://github.com/taishinaritomi/excss/pull/48) [`c7b6aa6`](https://github.com/taishinaritomi/excss/commit/c7b6aa6ae92302eb19cc57665b9edcba544ce62f) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - refactor: rename inject to helper

  ```diff
  // excss.config.ts
  import { defineConfig } from "excss/config";

  export default defineConfig({
  -  inject: ``,
  +  helper: ``,
  });
  ```

- [#32](https://github.com/taishinaritomi/excss/pull/32) [`6955f23`](https://github.com/taishinaritomi/excss/commit/6955f2330bcb59cf9366a64a52124e29c6352cd6) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: integrated variants field into inject field

  ```diff
  +import { variants } from "excss/config";

  {
  - variants: {
  -   red: "#ff0000",
  - },
    helper: `
  +   ${variants({
  +     red: "#ff0000",
  +   })}
      $breakpoints: (
        400: "screen and (max-width: 400px)",
        800: "screen and (max-width: 800px)",
        1000: "screen and (max-width: 1000px)",
      ) !default;

      @mixin mq($breakpoint) {
        @media #{map-get($breakpoints, $breakpoint)} {
            @content;
        }
      }
    `,
  }
  ```

### Patch Changes

- [#28](https://github.com/taishinaritomi/excss/pull/28) [`2f59bf8`](https://github.com/taishinaritomi/excss/commit/2f59bf85a9fe4148f9ddb4cc465bf5a0c9033fda) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: change in hash generation method for FILE_ID

- [#29](https://github.com/taishinaritomi/excss/pull/29) [`10b44d8`](https://github.com/taishinaritomi/excss/commit/10b44d85d4f05e4e0f7020a4d68b9b7af2024830) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - refactor: modification of the shim injected into wasm.

- [#31](https://github.com/taishinaritomi/excss/pull/31) [`7e18937`](https://github.com/taishinaritomi/excss/commit/7e189372376e10298e93c054e73619d59f8cde67) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: add support for ESM

## 0.0.1

### Patch Changes

- [#24](https://github.com/taishinaritomi/excss/pull/24) [`4bdae5f`](https://github.com/taishinaritomi/excss/commit/4bdae5f0e68b1b81dc4e69f53336a1186becde16) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: extracting the compiler package
