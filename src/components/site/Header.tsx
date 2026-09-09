"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { useFavorites } from "@/lib/client-store";

const NAV = [
  { fr: "Accueil", en: "Home", href: "/" },
  { fr: "Acheter", en: "Buy", href: "/biens?transaction=sale" },
  { fr: "Louer", en: "Rent", href: "/biens?transaction=rent" },
  { fr: "Propriétés", en: "Properties", href: "/biens" },
  { fr: "Quartiers", en: "Neighborhoods", href: "/quartiers" },
  { fr: "Agence", en: "Agency", href: "/agence" },
  { fr: "Journal", en: "Journal", href: "/blog" },
  { fr: "Contact", en: "Contact", href: "/contact" },
];

export default function Header({
  lang,
  agencyName,
  whatsapp,
}: {
  lang: Lang;
  agencyName: string;
  whatsapp: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { ids } = useFavorites();
  const transparentPage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || !transparentPage;

  function switchLang(next: Lang) {
    document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  const waHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        lang === "en" ? "Hello, I would like some information." : "Bonjour, je souhaite des informations.",
      )}`
    : "#";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid ? "border-b border-stone bg-warm/95 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 md:h-[86px] md:px-10">
          <Link href="/" className="flex flex-col leading-none">
            <span
              className={`font-display text-[22px] tracking-[0.02em] transition-colors md:text-[26px] ${
                solid ? "text-charcoal" : "text-white"
              }`}
            >
              {agencyName}
            </span>
            <span
              className={`label-xs mt-1 text-[9px] transition-colors ${
                solid ? "text-muted" : "text-white/70"
              }`}
            >
              Marrakech Real Estate
            </span>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-medium tracking-[0.02em] transition-colors hover:text-champagne ${
                  solid ? "text-charcoal" : "text-white"
                }`}
              >
                {lang === "en" ? item.en : item.fr}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/favoris"
              className={`relative hidden items-center transition-colors hover:text-champagne md:flex ${
                solid ? "text-charcoal" : "text-white"
              }`}
              aria-label="favorites"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21s-7.5-4.6-9.5-9A5.3 5.3 0 0 1 12 6.5 5.3 5.3 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9z" />
              </svg>
              {ids.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[10px] font-bold text-white">
                  {ids.length}
                </span>
              )}
            </Link>

            <div className={`hidden items-center gap-1 text-[12px] font-semibold md:flex ${solid ? "text-charcoal" : "text-white"}`}>
              <button
                onClick={() => switchLang("fr")}
                className={lang === "fr" ? "text-champagne" : "opacity-60 hover:opacity-100"}
              >
                FR
              </button>
              <span className="opacity-40">/</span>
              <button
                onClick={() => switchLang("en")}
                className={lang === "en" ? "text-champagne" : "opacity-60 hover:opacity-100"}
              >
                EN
              </button>
            </div>

            <Link
              href="/estimation"
              className={`label-xs hidden border px-5 py-3 transition-colors lg:inline-block ${
                solid
                  ? "border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                  : "border-white/70 text-white hover:bg-white hover:text-charcoal"
              }`}
            >
              {lang === "en" ? "List your property" : "Confiez-nous votre bien"}
            </Link>

            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className={`hidden transition-colors hover:text-champagne md:block ${solid ? "text-charcoal" : "text-white"}`}
              aria-label="whatsapp"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.53 3.75 1.45 5.31L2 22l4.98-1.6a9.8 9.8 0 0 0 5.06 1.4c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2Zm5.7 13.9c-.24.68-1.4 1.3-1.93 1.34-.5.05-.98.24-3.3-.7-2.77-1.13-4.53-3.98-4.67-4.17-.13-.19-1.1-1.48-1.1-2.83 0-1.34.7-2 .95-2.28.24-.27.53-.34.7-.34h.5c.16 0 .38-.06.6.46.23.56.77 1.9.84 2.04.07.14.11.3.02.48-.09.19-.13.3-.26.47-.13.16-.28.36-.4.48-.13.14-.27.28-.12.55.15.27.68 1.12 1.46 1.81 1 .9 1.85 1.17 2.12 1.3.27.14.42.11.58-.07.16-.19.67-.78.85-1.05.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.87.27.14.45.2.51.32.07.11.07.65-.17 1.33Z" />
              </svg>
            </a>

            <button
              onClick={() => setOpen(true)}
              className={`xl:hidden ${solid ? "text-charcoal" : "text-white"}`}
              aria-label="menu"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / full-screen nav */}
      <div
        className={`fixed inset-0 z-[60] bg-charcoal text-white transition-all duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between px-5 md:h-[86px] md:px-10">
          <span className="font-display text-[22px]">{agencyName}</span>
          <button onClick={() => setOpen(false)} aria-label="close">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>
        <nav className="flex h-[calc(100%-86px)] flex-col justify-center gap-1 overflow-y-auto px-8 pb-16">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ animationDelay: `${i * 45}ms` }}
              className={`font-display text-[38px] leading-[1.25] text-white/90 transition-colors hover:text-champagne md:text-[52px] ${
                open ? "fade-up" : ""
              }`}
            >
              {lang === "en" ? item.en : item.fr}
            </Link>
          ))}
          <div className="mt-10 flex flex-wrap items-center gap-5 text-[13px]">
            <Link href="/favoris" className="label-xs text-champagne">
              {lang === "en" ? "Favorites" : "Favoris"} ({ids.length})
            </Link>
            <Link href="/comparer" className="label-xs text-white/70">
              {lang === "en" ? "Compare" : "Comparer"}
            </Link>
            <Link href="/estimation" className="label-xs text-white/70">
              {lang === "en" ? "Valuation" : "Estimation"}
            </Link>
            <div className="flex items-center gap-2 font-semibold">
              <button onClick={() => switchLang("fr")} className={lang === "fr" ? "text-champagne" : "text-white/60"}>
                FR
              </button>
              <span className="text-white/30">/</span>
              <button onClick={() => switchLang("en")} className={lang === "en" ? "text-champagne" : "text-white/60"}>
                EN
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
