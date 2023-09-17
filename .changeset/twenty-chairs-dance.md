---
"@excss/compiler": patch
"excss": patch
---

chore: due to the failure of the 0.1.0 npm release

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
