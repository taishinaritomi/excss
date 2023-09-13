import { defineConfig, variants } from "excss/config";

export default defineConfig({
  inject: `
    ${variants({
      primary: "red",
      sm: '"max-width: 300px"',
    })}
  `,
});
