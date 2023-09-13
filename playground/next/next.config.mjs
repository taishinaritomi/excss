import createBundleAnalyzer from "@next/bundle-analyzer";
import createExcss from "excss/next";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env["ANALYZE"] === "true",
});

const withExcss = createExcss();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withBundleAnalyzer(withExcss(nextConfig));
