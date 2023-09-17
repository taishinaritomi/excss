import { defineConfig, variants } from "excss/config";

export default defineConfig({
  helpers: `
    ${variants({
      primary: "red",
      sm: '"max-width: 300px"',
    })}
  `,
});
