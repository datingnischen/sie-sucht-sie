import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  async redirects() {
    return [
      { source: "/magazin/wp-sitemap.xml", destination: "/magazin/sitemap.xml", permanent: true },
      { source: "/magazin/sitemap_index.xml", destination: "/magazin/sitemap.xml", permanent: true },
      { source: "/magazin/post-sitemap.xml", destination: "/magazin/sitemap.xml", permanent: true },
      { source: "/magazin/page-sitemap.xml", destination: "/magazin/sitemap.xml", permanent: true },
      { source: "/magazin/szenebars-berlin", destination: "/magazin/lesbische-szenebars-in-berlin", permanent: true },
      { source: "/magazin/queer-definition-bedeutung", destination: "/magazin/queer", permanent: true },
      { source: "/magazin/autor/alicia-schlienz", destination: "/magazin/alicia", permanent: true },
      { source: "/magazin/autor/christian-m-haas", destination: "/magazin/christian-m-haas", permanent: true },
      // WordPress archives that are not rebuilt: tag listings (mostly contact ads), date archives, pagination.
      { source: "/magazin/kategorie/kontaktanzeigen/:rest*", destination: "/magazin", permanent: true },
      { source: "/magazin/schlagwort/:rest*", destination: "/magazin", permanent: true },
      { source: "/magazin/page/:page(\\d+)", destination: "/magazin", permanent: true },
      { source: "/magazin/:year(\\d{4})/:rest*", destination: "/magazin", permanent: true },
    ];
  },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static-cms.icony-hosting.de" },
      { protocol: "https", hostname: "static2.icony-hosting.de" },
      { protocol: "https", hostname: "www.sie-sucht-sie.de" },
    ],
  },
};

export default nextConfig;
