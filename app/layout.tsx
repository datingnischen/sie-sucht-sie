import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import "./theme.css";
import { Footer, Header } from "@/components/site-shell";
import { StickyCta } from "@/components/sticky-cta";
import { SITE_URL } from "@/lib/site";
import { staticAsset, assetHost } from "@/lib/static-asset.mjs";
import { Analytics } from "@vercel/analytics/next";
import { vercelAnalyticsProps } from "@/lib/vercel-analytics";

// Überschriften in Fraunces (weich, mit Kursiv für Akzente), Fließtext bleibt Open Sans von ICONY.
const display = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "opsz"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sie sucht Sie – Frauen kennenlernen",
  description: "Lerne lesbische und bisexuelle Single-Frauen kennen – sicher, persönlich und kostenlos.",
  openGraph: { type: "website", locale: "de_DE", siteName: "Sie-sucht-Sie.de" },
  // Icons liegen in public/brand und kommen vom Asset-Host, weil der nginx nur Seitenrouten durchreicht.
  icons: { icon: staticAsset("/brand/icon.png"), apple: staticAsset("/brand/apple-icon.png") },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de" className={display.variable}><body><Header />{children}<Footer /><StickyCta /><Analytics {...vercelAnalyticsProps(assetHost)} /></body></html>;
}
