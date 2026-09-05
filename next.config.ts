import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Next.js 16 uses Turbopack by default
  turbopack: {},
};

export default nextConfig;
