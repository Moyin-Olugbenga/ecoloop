import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
    ignoreBuildErrors: true,
  },
   experimental: {
    serverExternalPackages: ['@prisma/client'],
  },
  // eslint: {
  //   // Also ignore ESLint errors if needed
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
