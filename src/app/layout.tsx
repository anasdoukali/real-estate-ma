import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { getLang } from "@/lib/lang";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ?? "https://mapygo-real-estate.amine-27.chatgpt.site",
  ),
  title: {
    default: "MAPYGO REAL ESTATE — Immobilier d'exception à Marrakech",
    template: "%s | MAPYGO REAL ESTATE",
  },
  icons: {
    icon: "/brand/lv-real-estate-symbol.png",
  },
  description:
    "Villas, riads, appartements et propriétés d'exception à Marrakech. Achat, location, investissement et estimation par une agence locale.",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "MAPYGO REAL ESTATE",
    title: "MAPYGO REAL ESTATE — Immobilier d'exception à Marrakech",
    description:
      "Villas, riads, appartements et propriétés d'exception à Marrakech.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "MAPYGO REAL ESTATE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAPYGO REAL ESTATE — Immobilier d'exception à Marrakech",
    description:
      "Villas, riads, appartements et propriétés d'exception à Marrakech.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
