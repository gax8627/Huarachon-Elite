import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tb-static.uber.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
