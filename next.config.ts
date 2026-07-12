import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
    // ⚠️ Warning: This allows production builds to succeed even with type errors
    ignoreBuildErrors: true,
  },
  // eslint: {
  //   // Also ignore ESLint errors if needed
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
