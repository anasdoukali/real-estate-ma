import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import type { AgencySettings } from "@/db/schema";
import NewsletterForm from "./NewsletterForm";

export default function Footer({
  lang,
  settings,
  neighborhoods,
}: {
  lang: Lang;
  settings: AgencySettings;
  neighborhoods: { name: string; slug: string }[];
}) {
  const en = lang === "en";
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="relative h-[68px] w-[212px]">
              <Image
                src="/brand/louka-vendy-gold.png"
                alt={settings.agencyName}
                fill
                sizes="212px"
                className="object-contain"
              />
            </div>
            <p className="mt-7 max-w-sm text-[14px] leading-relaxed text-white/60">
              {en
                ? "A Marrakech-based agency dedicated to exceptional properties: contemporary villas, historic riads, apartments and confidential estates."
                : "Agence marrakchie dédiée aux biens d'exception : villas contemporaines, riads historiques, appartements et propriétés confidentielles."}
            </p>
            <div className="mt-8 flex gap-4 text-[12px] text-white/60">
              {settings.instagram && (
                <a href={settings.instagram} className="hover:text-champagne" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} className="hover:text-champagne" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} className="hover:text-champagne" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="label-xs text-champagne">{en ? "Properties" : "Propriétés"}</p>
            <ul className="mt-6 space-y-3 text-[14px] text-white/65">
              <li><Link href="/biens?transaction=sale" className="hover:text-white">{en ? "Buy" : "Acheter"}</Link></li>
              <li><Link href="/biens?transaction=rent" className="hover:text-white">{en ? "Rent" : "Louer"}</Link></li>
              <li><Link href="/types/villa" className="hover:text-white">Villas</Link></li>
              <li><Link href="/types/riad" className="hover:text-white">Riads</Link></li>
              <li><Link href="/types/appartement" className="hover:text-white">{en ? "Apartments" : "Appartements"}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="label-xs text-champagne">{en ? "Neighborhoods" : "Quartiers"}</p>
            <ul className="mt-6 space-y-3 text-[14px] text-white/65">
              {neighborhoods.slice(0, 5).map((n) => (
                <li key={n.slug}>
                  <Link href={`/quartiers/${n.slug}`} className="hover:text-white">
                    {n.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="label-xs text-champagne">{en ? "Agency" : "Agence"}</p>
            <ul className="mt-6 space-y-3 text-[14px] text-white/65">
              <li><Link href="/agence" className="hover:text-white">{en ? "About us" : "Notre agence"}</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/estimation" className="hover:text-white">{en ? "Valuation" : "Estimation"}</Link></li>
              <li><Link href="/home-staging" className="hover:text-white">Home Staging</Link></li>
              <li><Link href="/confiez-nous-votre-bien" className="hover:text-white">{en ? "List your property" : "Confiez-nous votre bien"}</Link></li>
              <li><Link href="/blog" className="hover:text-white">{en ? "Journal" : "Journal"}</Link></li>
              <li><Link href="/favoris" className="hover:text-white">{en ? "Favorites" : "Favoris"}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="label-xs text-champagne">Contact</p>
            <ul className="mt-6 space-y-3 text-[14px] text-white/65">
              {settings.phone && <li><a href={`tel:${settings.phone}`} className="hover:text-white">{settings.phone}</a></li>}
              {settings.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                    className="hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {settings.email && <li><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></li>}
              {settings.address && <li className="leading-relaxed">{settings.address}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <p className="font-display text-[26px] leading-tight lg:col-span-5">
              {en ? "New properties, straight to your inbox." : "Les nouvelles propriétés, directement dans votre boîte mail."}
            </p>
            <div className="lg:col-span-7">
              <NewsletterForm lang={lang} dark />
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 text-[12px] text-white/40 md:grid-cols-[1fr_auto] md:items-center xl:grid-cols-[1fr_auto_1fr]">
          <p>© {new Date().getFullYear()} {settings.agencyName}. {en ? "All rights reserved." : "Tous droits réservés."}</p>
          <div className="flex items-center gap-3 md:justify-self-end xl:order-2 xl:justify-self-center">
            <span className="whitespace-nowrap">{en ? "Website by" : "Site conçu par"}</span>
            <Image
              src="/brand/feedback-logo.svg"
              alt="Feedback Branding Studio"
              width={320}
              height={98}
              sizes="112px"
              className="h-auto w-28 opacity-75"
            />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-2 xl:col-span-1 xl:order-3 xl:justify-self-end">
            <span>{en ? "Legal notice" : "Mentions légales"}</span>
            <span>{en ? "Privacy" : "Confidentialité"}</span>
            <span>Cookies</span>
            <Link href="/admin" className="hover:text-champagne">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
