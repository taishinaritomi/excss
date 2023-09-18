---
"@excss/compiler": patch
"excss": patch
---

release 0.3.1

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
