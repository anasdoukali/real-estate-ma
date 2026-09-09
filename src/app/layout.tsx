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
  title: {
    default: "[AGENCY NAME] — Immobilier d'exception à Marrakech",
    template: "%s | [AGENCY NAME]",
  },
  description:
    "Villas, riads, appartements et propriétés d'exception à Marrakech. Achat, location, investissement et estimation par une agence locale.",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "[AGENCY NAME]",
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
