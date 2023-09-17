---
"@excss/compiler": minor
"excss": minor
---

refactor: rename inject to helper

```diff
// excss.config.ts
import { defineConfig } from "excss/config";

export default defineConfig({
-  inject: ``,
+  helper: ``,
});
```
