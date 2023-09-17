# excss

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

- Updated dependencies [[`3fbe77b`](https://github.com/taishinaritomi/excss/commit/3fbe77b2aef699108519e69fdfec316e66d14b48)]:
  - @excss/compiler@0.1.1

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

- [#35](https://github.com/taishinaritomi/excss/pull/35) [`8953f56`](https://github.com/taishinaritomi/excss/commit/8953f568fe6cf6565bba3c8d5e729fcb790d1221) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: support for excss.config.ts

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

  A new file `excss.config.ts` has been introduced to house the excess configuration settings, which includes the `inject` option.

  ```diff
  +import { defineConfig } from "excss/config";
  +
  +export default defineConfig({
  +  helper: ``,
  +});
  ```

- [#40](https://github.com/taishinaritomi/excss/pull/40) [`5e03c41`](https://github.com/taishinaritomi/excss/commit/5e03c417592395481f74a82e10a4b3ee911902c9) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - refactor: webpack plugin

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

- [#33](https://github.com/taishinaritomi/excss/pull/33) [`9d49dc8`](https://github.com/taishinaritomi/excss/commit/9d49dc840eaceebe2bdf7a43f72548c70b3adb9a) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: change export method for plugins from named export to default export

  ```diff
  -import { Excss } from "excss/vite";
  +import Excss from "excss/vite";

  -import { ExcssPlugin } from "excss/webpack";
  +import ExcssPlugin from "excss/webpack";

  -import { createExcss } from "excss/next";
  +import createExcss from "excss/next";
  ```

### Patch Changes

- [#28](https://github.com/taishinaritomi/excss/pull/28) [`2f59bf8`](https://github.com/taishinaritomi/excss/commit/2f59bf85a9fe4148f9ddb4cc465bf5a0c9033fda) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: change in hash generation method for FILE_ID

- [#49](https://github.com/taishinaritomi/excss/pull/49) [`303e279`](https://github.com/taishinaritomi/excss/commit/303e279b52f3341d91cf66db68f2a8711868f3f1) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - fix: remove next warn log

- [#31](https://github.com/taishinaritomi/excss/pull/31) [`7e18937`](https://github.com/taishinaritomi/excss/commit/7e189372376e10298e93c054e73619d59f8cde67) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: add support for ESM

- [#34](https://github.com/taishinaritomi/excss/pull/34) [`05dd416`](https://github.com/taishinaritomi/excss/commit/05dd416d55553e3599871321b031fedb2b875b21) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat(next-plugin): simplify next plugin

- Updated dependencies [[`2f59bf8`](https://github.com/taishinaritomi/excss/commit/2f59bf85a9fe4148f9ddb4cc465bf5a0c9033fda), [`c7b6aa6`](https://github.com/taishinaritomi/excss/commit/c7b6aa6ae92302eb19cc57665b9edcba544ce62f), [`6955f23`](https://github.com/taishinaritomi/excss/commit/6955f2330bcb59cf9366a64a52124e29c6352cd6), [`10b44d8`](https://github.com/taishinaritomi/excss/commit/10b44d85d4f05e4e0f7020a4d68b9b7af2024830), [`7e18937`](https://github.com/taishinaritomi/excss/commit/7e189372376e10298e93c054e73619d59f8cde67)]:
  - @excss/compiler@0.1.0

## 0.0.11

### Patch Changes

- [#24](https://github.com/taishinaritomi/excss/pull/24) [`4bdae5f`](https://github.com/taishinaritomi/excss/commit/4bdae5f0e68b1b81dc4e69f53336a1186becde16) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: extracting the compiler package

- Updated dependencies [[`4bdae5f`](https://github.com/taishinaritomi/excss/commit/4bdae5f0e68b1b81dc4e69f53336a1186becde16)]:
  - @excss/compiler@0.0.1

## 0.0.10

### Patch Changes

- [#22](https://github.com/taishinaritomi/excss/pull/22) [`813a355`](https://github.com/taishinaritomi/excss/commit/813a35596c5e67373f50f042217323e06e62f93d) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: change the export name of the plugin

## 0.0.9

### Patch Changes

- [#18](https://github.com/taishinaritomi/excss/pull/18) [`f0d4886`](https://github.com/taishinaritomi/excss/commit/f0d48866d2eac5d4d5917c95b691fb9092e87312) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: strict the types for the ex API and add tests

## 0.0.8

### Patch Changes

- [#16](https://github.com/taishinaritomi/excss/pull/16) [`4f162a0`](https://github.com/taishinaritomi/excss/commit/4f162a0ac75e474ba3fe1cf4d6ed15a4652b7e20) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: make the ex API simpler.

## 0.0.7

### Patch Changes

- [#14](https://github.com/taishinaritomi/excss/pull/14) [`2ef4ca7`](https://github.com/taishinaritomi/excss/commit/2ef4ca7c55265cc301f234eca815fe9d2fb64a7d) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - fix: fixed the issue where FILE_ID cannot be used without variants options

## 0.0.6

### Patch Changes

- [#12](https://github.com/taishinaritomi/excss/pull/12) [`aeefa33`](https://github.com/taishinaritomi/excss/commit/aeefa3347431bcda9635dc2086e22def92f62d27) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - fix: fix build script

## 0.0.5

### Patch Changes

- [#10](https://github.com/taishinaritomi/excss/pull/10) [`b66d7ab`](https://github.com/taishinaritomi/excss/commit/b66d7abd491d5d876a7d1294309d726cb7e32e77) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - fix: change the out dir for wasm

## 0.0.4

### Patch Changes

- [#8](https://github.com/taishinaritomi/excss/pull/8) [`8ec4538`](https://github.com/taishinaritomi/excss/commit/8ec4538946971b720d4a5f9eaa15b8fff1756fb9) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - fix: fix build script

## 0.0.3

### Patch Changes

- [#6](https://github.com/taishinaritomi/excss/pull/6) [`779d661`](https://github.com/taishinaritomi/excss/commit/779d661b1290e8bd14bcc7a6cc7b49357fbdcaf4) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - fix: fix missing binding in package.json

## 0.0.2

### Patch Changes

- [#3](https://github.com/taishinaritomi/excss/pull/3) [`e698c14`](https://github.com/taishinaritomi/excss/commit/e698c14cf3a40783b2710532b784f9dbda8b9ec5) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - chore: release version-0.0.2
