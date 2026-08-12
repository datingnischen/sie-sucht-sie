import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "@/components/site-shell";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sie sucht Sie – Frauen kennenlernen",
  description: "Lerne lesbische und bisexuelle Single-Frauen kennen – sicher, persönlich und kostenlos.",
  openGraph: { type: "website", locale: "de_DE", siteName: "Sie-sucht-Sie.de" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body><Header />{children}<Footer /></body></html>;
}
