---
"@excss/compiler": minor
"excss": minor
---

feat: integrated variants field into inject field

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
