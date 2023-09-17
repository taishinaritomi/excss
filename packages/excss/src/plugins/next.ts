import type { NextConfig } from "next";
import type { Configuration } from "webpack";
import ExcssPlugin from "./webpack/plugin.ts";

export default function createPlugin() {
  return (nextConfig: NextConfig): NextConfig => {
    return {
      ...nextConfig,
      webpack(config: Configuration, options) {
        config.plugins?.push(new ExcssPlugin());
        config.infrastructureLogging = { level: "error" };

        if (typeof nextConfig.webpack === "function") {
          return nextConfig.webpack(config, options) as unknown;
        }

        return config;
      },
    };
  };
}
