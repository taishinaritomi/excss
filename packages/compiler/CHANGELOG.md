# @excss/compiler

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

## 0.0.1

### Patch Changes

- [#24](https://github.com/taishinaritomi/excss/pull/24) [`4bdae5f`](https://github.com/taishinaritomi/excss/commit/4bdae5f0e68b1b81dc4e69f53336a1186becde16) Thanks [@taishinaritomi](https://github.com/taishinaritomi)! - feat: extracting the compiler package
