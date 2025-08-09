import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Force dynamic rendering for all pages
  output: 'standalone',
};

export default nextConfig;
