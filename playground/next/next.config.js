const createBundleAnalyzer = require("@next/bundle-analyzer");
const { createExcssPlugin } = require("excss/next");

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env["ANALYZE"] === "true",
});

const withExcss = createExcssPlugin({
  variants: {
    primary: "green",
    sm: '"max-width: 300px"',
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withBundleAnalyzer(withExcss(nextConfig));
