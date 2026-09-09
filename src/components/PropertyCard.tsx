"use client";

import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { pick } from "@/lib/i18n";
import { formatPrice, propertyTypeLabel } from "@/lib/site";
import { useCompare, useFavorites } from "@/lib/client-store";

export type CardProperty = {
  id: number;
  slug: string;
  reference: string;
  titleFr: string;
  titleEn: string | null;
  price: string;
  currency: string;
  priceType: string;
  rentalFrequency: string | null;
  transactionType: string;
  propertyType: string;
  status: string;
  isExclusive: boolean;
  isNew: boolean;
  bedrooms: number | null;
  bathrooms: number | null;
  livingArea: number | null;
  landArea: number | null;
  coverImage: string | null;
  neighborhoodName?: string | null;
  city?: string | null;
};

export function priceLabel(p: CardProperty, lang: Lang) {
  if (p.priceType === "on_request") return lang === "en" ? "Price on request" : "Prix sur demande";
  const base = formatPrice(p.price, p.currency, lang);
  const prefix = p.priceType === "starting_from" ? (lang === "en" ? "From " : "À partir de ") : "";
  const suffix =
    p.transactionType === "rent"
      ? p.rentalFrequency === "day"
        ? lang === "en"
          ? " / night"
          : " / nuit"
        : lang === "en"
          ? " / month"
          : " / mois"
      : "";
  return `${prefix}${base}${suffix}`;
}

export default function PropertyCard({
  property,
  lang,
  onHover,
  compact = false,
}: {
  property: CardProperty;
  lang: Lang;
  onHover?: (id: number | null) => void;
  compact?: boolean;
}) {
  const { ids: favIds, toggle: toggleFav } = useFavorites();
  const { ids: cmpIds, toggle: toggleCmp } = useCompare();
  const isFav = favIds.includes(property.id);
  const inCompare = cmpIds.includes(property.id);
  const title = pick(lang, property.titleFr, property.titleEn);

  const badges: { text: string; dark?: boolean }[] = [];
  if (property.status === "sold") badges.push({ text: lang === "en" ? "Sold" : "Vendu", dark: true });
  else if (property.status === "rented") badges.push({ text: lang === "en" ? "Rented" : "Loué", dark: true });
  else {
    if (property.isExclusive) badges.push({ text: lang === "en" ? "Exclusive" : "Exclusivité" });
    if (property.isNew) badges.push({ text: lang === "en" ? "New" : "Nouveau", dark: true });
    badges.push({
      text:
        property.transactionType === "rent"
          ? lang === "en"
            ? "For rent"
            : "À louer"
          : lang === "en"
            ? "For sale"
            : "À vendre",
      dark: true,
    });
  }

  return (
    <article
      className="group relative flex flex-col bg-white"
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <Link href={`/biens/${property.slug}`} className="relative block overflow-hidden bg-stone">
        <div className={compact ? "relative aspect-[16/11]" : "relative aspect-[4/3]"}>
          {property.coverImage ? (
            <Image
              src={property.coverImage}
              alt={title}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs tracking-[0.2em] text-muted">
              [AGENCY NAME]
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span
              key={b.text}
              className={`label-xs px-2.5 py-1.5 backdrop-blur-sm ${
                b.dark ? "bg-charcoal/85 text-white" : "bg-champagne text-white"
              }`}
            >
              {b.text}
            </span>
          ))}
        </div>
      </Link>

      <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-90 transition group-hover:opacity-100">
        <button
          type="button"
          aria-label="favorite"
          onClick={() => toggleFav(property.id)}
          className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
            isFav ? "bg-champagne text-white" : "bg-white/85 text-charcoal hover:bg-white"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
            <path d="M12 21s-7.5-4.6-9.5-9A5.3 5.3 0 0 1 12 6.5 5.3 5.3 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="compare"
          onClick={() => toggleCmp(property.id)}
          className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
            inCompare ? "bg-charcoal text-white" : "bg-white/85 text-charcoal hover:bg-white"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 7h16M4 7l3-3M4 7l3 3M20 17H4m16 0-3-3m3 3-3 3" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 border border-t-0 border-stone px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/biens/${property.slug}`}>
              <h3 className="text-[17px] font-medium leading-snug tracking-[-0.01em] transition-colors group-hover:text-champagne">
                {title}
              </h3>
            </Link>
            <p className="mt-1.5 text-[13px] text-muted">
              {property.neighborhoodName ? `${property.neighborhoodName}, ` : ""}
              {property.city ?? "Marrakech"}
            </p>
          </div>
        </div>
        <p className="font-display text-[26px] leading-none text-charcoal">{priceLabel(property, lang)}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-stone pt-3 text-[12.5px] text-muted">
          {property.bedrooms ? (
            <span>
              {property.bedrooms} {lang === "en" ? "bed" : "ch."}
            </span>
          ) : null}
          {property.bathrooms ? (
            <span>
              {property.bathrooms} {lang === "en" ? "bath" : "sdb"}
            </span>
          ) : null}
          {property.livingArea ? <span>{property.livingArea} m²</span> : null}
          {!property.livingArea && property.landArea ? <span>{property.landArea} m²</span> : null}
          <span className="ml-auto label-xs text-champagne">{propertyTypeLabel(property.propertyType, lang)}</span>
        </div>
      </div>
    </article>
  );
}
