import type { NextConfig } from "next";
import { lazyPostCSS } from "next/dist/build/webpack/config/blocks/css/index.js";
import { getGlobalCssLoader } from "next/dist/build/webpack/config/blocks/css/loaders/index.js";
import type { ConfigurationContext } from "next/dist/build/webpack/config/utils.js";
import type { Configuration, RuleSetRule } from "webpack";
import type { ExcssOption } from "./webpack/plugin.ts";
import ExcssPlugin from "./webpack/plugin.ts";

type ExcssConfig = {
  /**
   * @default {}
   */
  inject?: string;
};

function plugin(nextConfig: NextConfig, excssConfig: ExcssConfig) {
  return {
    webpack(config: Configuration & ConfigurationContext, options) {
      const { dir, dev, isServer, config: resolvedNextConfig } = options;
      const cssRules = (
        config.module?.rules?.find((rule) => {
          return rule
            ? typeof rule === "object" &&
                Array.isArray(rule.oneOf) &&
                rule.oneOf.some((oneOfRule) => {
                  return oneOfRule
                    ? oneOfRule.test instanceof RegExp &&
                        typeof oneOfRule.test.test === "function" &&
                        oneOfRule.test.test("filename.css")
                    : false;
                })
            : false;
        }) as RuleSetRule
      ).oneOf;

      cssRules?.unshift({
        test: /.css$/,
        sideEffects: true,
        use: getGlobalCssLoader(
          {
            assetPrefix: config.assetPrefix,
            isClient: !isServer,
            isServer,
            isDevelopment: dev,
            future: (resolvedNextConfig["future"] as unknown) || {},
            experimental: resolvedNextConfig.experimental,
            hasAppDir: true,
          } as ConfigurationContext,
          () => lazyPostCSS(dir, undefined, undefined),
          [],
        ),
      });

      // const isAppDir = true;

      const excssWebpackPluginOption: ExcssOption = {
        cssOutDir: "./.next/cache/excss",
        inject: excssConfig.inject,
      };

      config.plugins?.push(new ExcssPlugin(excssWebpackPluginOption));

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
