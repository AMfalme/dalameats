import type { NextConfig } from "next";
module.exports = {
  output: "standalone",
};

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/dalameats",
  reactStrictMode: true,
};

export default nextConfig;
