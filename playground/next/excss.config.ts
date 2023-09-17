import { defineConfig, variants } from "excss/config";

export default defineConfig({
  helper: `
    ${variants({
      primary: "red",
      sm: '"max-width: 300px"',
    })}
  `,
});
