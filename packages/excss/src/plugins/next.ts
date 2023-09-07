import type { NextConfig } from "next";
import type { Configuration } from "webpack";
import ExcssPlugin from "./webpack/plugin.ts";

type ExcssConfig = {
  /**
   * @default {}
   */
  inject?: string;
};

function plugin(nextConfig: NextConfig, excssConfig: ExcssConfig) {
  return {
    webpack(config: Configuration, options) {
      config.plugins?.push(
        new ExcssPlugin({
          cssOutDir: "./.next/cache/excss",
          inject: excssConfig.inject,
        }),
      );

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options) as unknown;
      }

      return config;
    },
  } as NextConfig;
}

export default function createPlugin(excssConfig: ExcssConfig) {
  return (nextConfig: NextConfig): NextConfig => {
    return Object.assign({}, nextConfig, plugin(nextConfig, excssConfig));
  };
}
