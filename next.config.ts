import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  ...(process.env.NODE_ENV === 'production' ? {
    basePath: '/wip',
    assetPrefix: '/wip',
  } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
