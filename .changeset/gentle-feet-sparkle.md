---
"excss": minor
---

feat: support for excss.config.ts

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
