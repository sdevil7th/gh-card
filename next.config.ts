import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/github-card.png",
        destination: "/api/og",
      },
    ];
  },
};

export default nextConfig;
