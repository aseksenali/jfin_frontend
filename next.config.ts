import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    reactStrictMode: true,
    output: 'standalone',
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
            allowedOrigins: ['localhost:3000'],
        }
    }
};

export default nextConfig;
