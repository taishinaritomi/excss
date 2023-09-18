# excss

## 0.3.1

### Patch Changes

- [#56](https://github.com/taishinaritomi/excss/pull/56) [`5b865ae`](https://github.com/taishinaritomi/excss/commit/5b865ae9532c4c3c3125f251d4c83565de2a8656) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - release 0.3.1

  refactor: rename inject to helper

  ```diff
  // excss.config.ts
  import { defineConfig } from "excss/config";

  export default defineConfig({
  -  inject: ``,
  +  helper: ``,
  });
  ```

  feat: support for excss.config.ts

  ```diff
  // excss.config.ts
  +import { defineConfig } from "excss/config";
  +
  +export default defineConfig({
  +  helper: ``,
  +});
  ```

  feat: integrated variants field into helper field

  ```diff
  // excss.config.ts
  +import { variants } from "excss/config";

  +export default defineConfig({
  - variants: {
  -   red: "#ff0000",
  - },
    helper: `
  +   ${variants({
  +     red: "#ff0000",
  +   })}
    `,
  +});
  ```

  feat: change export method for plugins from named export to default export

  ```diff
  -import { Excss } from "excss/vite";
  +import Excss from "excss/vite";

  -import { ExcssPlugin } from "excss/webpack";
  +import ExcssPlugin from "excss/webpack";

  -import { createExcss } from "excss/next";
  +import createExcss from "excss/next";
  ```

- Updated dependencies [[`5b865ae`](https://github.com/taishinaritomi/excss/commit/5b865ae9532c4c3c3125f251d4c83565de2a8656)]:
  - @excss/compiler@0.3.1

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
