---
"excss": minor
---

feat: support for excss.config.ts

```diff

// vite.config.ts
Excss({
-  inject: ``,
})

// webpack.config.ts
new ExcssPlugin({
-  inject: ``,
}),

// next.config.mjs
const withExcss = createExcss({
-  inject: ``,
});



// excss.config.ts
+import { defineConfig } from "excss/config";
+
+export default defineConfig({
+  inject: ``,
+});

```
