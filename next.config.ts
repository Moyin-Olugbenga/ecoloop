import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
    ignoreBuildErrors: true,
  },
  
  // eslint: {
  //   // Also ignore ESLint errors if needed
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
