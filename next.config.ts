import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/wip',
  images: {
    unoptimized: true,
  },
  assetPrefix: '/wip',
};

export default nextConfig;
