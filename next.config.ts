import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static-cms.icony-hosting.de" },
      { protocol: "https", hostname: "static2.icony-hosting.de" },
      { protocol: "https", hostname: "www.sie-sucht-sie.de" },
    ],
  },
};

export default nextConfig;
