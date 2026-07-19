import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/orion",
  assetPrefix: "/orion/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
