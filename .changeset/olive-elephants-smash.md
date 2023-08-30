---
"excss": minor
---

feat: change export method for plugins from named export to default export

```diff
-import { Excss } from "excss/vite";
+import Excss from "excss/vite";

-import { ExcssPlugin } from "excss/webpack";
+import ExcssPlugin from "excss/webpack";

-import { createExcss } from "excss/next";
+import createExcss from "excss/next";
```
