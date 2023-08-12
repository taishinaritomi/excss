import type { NextConfig } from "next";
import { lazyPostCSS } from "next/dist/build/webpack/config/blocks/css";
import { getGlobalCssLoader } from "next/dist/build/webpack/config/blocks/css/loaders";
import type { ConfigurationContext } from "next/dist/build/webpack/config/utils";
import type { Configuration, RuleSetRule } from "webpack";
import type { Variants } from "../compiler";
import { ExcssWebpackPlugin } from "./webpack/plugin";
import type { ExcssWebpackPluginOption } from "./webpack/plugin";

type ExcssConfig = {
  /**
   * @default {}
   */
  variants?: Variants;
};

export function createExcssPlugin(excssConfig: ExcssConfig) {
  return (nextConfig: NextConfig): NextConfig => {
    return Object.assign({}, nextConfig, excssPlugin(nextConfig, excssConfig));
  };
}

function excssPlugin(nextConfig: NextConfig, excssConfig: ExcssConfig) {
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
            hasAppDir: resolvedNextConfig.experimental.appDir,
          } as ConfigurationContext,
          () => lazyPostCSS(dir, undefined, undefined),
          [],
        ),
      });

      const isAppDir = resolvedNextConfig.experimental.appDir ?? true;

      const excssWebpackPluginOption: ExcssWebpackPluginOption = {
        cssOutDir: isAppDir ? "./.next/cache/excss" : undefined,
        variants: excssConfig.variants,
      };

      config.plugins?.push(new ExcssWebpackPlugin(excssWebpackPluginOption));

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options) as unknown;
      }

      return config;
    },
  } as NextConfig;
}
