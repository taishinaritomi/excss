import { type ViteUserConfig, defineWorkspace } from "vitest/config";

export const sharedConfig = {
  test: {
    includeSource: ["src/**/*.{ts,tsx}"],
    typecheck: {
      checker: "tsc",
      include: ["src/**/*.spec.*"],
    },
  },
} satisfies ViteUserConfig;

export default defineWorkspace(["./packages/*"]);
