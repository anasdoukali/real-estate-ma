"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PropertyCard, { priceLabel, type CardProperty } from "@/components/PropertyCard";
import type { MapPoint } from "./PropertyMap";
import type { Lang } from "@/lib/i18n";
import { propertyTypeLabel } from "@/lib/site";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full animate-pulse bg-stone" />,
});

export default function ListingResults({
  items,
  points,
  lang,
  total,
}: {
  items: CardProperty[];
  points: MapPoint[];
  lang: Lang;
  total: number;
}) {
  const en = lang === "en";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [hovered, setHovered] = useState<number | null>(null);
  const sort = searchParams.get("sort") ?? "recent";

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const views: { key: "grid" | "list" | "map"; label: string }[] = [
    { key: "grid", label: en ? "Grid" : "Grille" },
    { key: "list", label: en ? "List" : "Liste" },
    { key: "map", label: en ? "Map" : "Carte" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-sand pb-6">
        <p className="text-[14px] text-secondary">
          <span className="font-semibold text-charcoal">{total}</span> {en ? "properties found" : "biens trouvés"}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 border border-sand bg-surface px-4 text-[13px] outline-none focus:border-champagne"
          >
            <option value="recent">{en ? "Most recent" : "Plus récents"}</option>
            <option value="price_asc">{en ? "Price ascending" : "Prix croissant"}</option>
            <option value="price_desc">{en ? "Price descending" : "Prix décroissant"}</option>
            <option value="surface">{en ? "Surface" : "Surface"}</option>
          </select>
          <div className="flex">
            {views.map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`label-xs border px-4 py-3 transition-colors ${
                  view === v.key
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-sand text-secondary hover:border-charcoal hover:text-charcoal"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {items.length === 0 && (
        <p className="py-24 text-center text-[15px] text-secondary">
          {en ? "No property matches your search." : "Aucun bien ne correspond à votre recherche."}
        </p>
      )}

      {view === "grid" && (
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} lang={lang} />
          ))}
        </div>
      )}

      {view === "list" && (
        <div className="mt-10 flex flex-col gap-6">
          {items.map((p) => (
            <ListRow key={p.id} property={p} lang={lang} />
          ))}
        </div>
      )}

      {view === "map" && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[45%_55%]">
          <div className="flex max-h-[820px] flex-col gap-6 overflow-y-auto pr-2">
            {items.map((p) => (
              <div key={p.id} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}>
                <PropertyCard property={p} lang={lang} compact />
              </div>
            ))}
          </div>
          <div className="sticky top-[100px] h-[820px] overflow-hidden border border-stone">
            <PropertyMap points={points} activeId={hovered} height={820} onSelect={setHovered} />
          </div>
        </div>
      )}
    </div>
  );
}

function ListRow({ property, lang }: { property: CardProperty; lang: Lang }) {
  const en = lang === "en";
  return (
    <article className="property-color-card group grid gap-0 border border-charcoal/15 bg-surface md:grid-cols-[38%_62%]">
      <Link href={`/biens/${property.slug}`} className="relative aspect-[4/3] overflow-hidden bg-stone md:aspect-auto md:min-h-[280px]">
        {property.coverImage && (
          <Image
            src={property.coverImage}
            alt={property.titleFr}
            fill
            sizes="40vw"
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.035]"
          />
        )}
        <span className="label-xs absolute left-4 top-4 bg-charcoal/85 px-2.5 py-1.5 text-white">
          {property.transactionType === "rent" ? (en ? "For rent" : "À louer") : en ? "For sale" : "À vendre"}
        </span>
      </Link>
      <div className="flex flex-col justify-between p-7">
        <div>
          <p className="label-xs text-accent">{propertyTypeLabel(property.propertyType, lang)}</p>
          <Link href={`/biens/${property.slug}`}>
            <h3 className="mt-3 font-display text-[28px] leading-tight group-hover:text-accent">
              {en ? property.titleEn || property.titleFr : property.titleFr}
            </h3>
          </Link>
          <p className="mt-2 text-[13.5px] text-secondary">
            {property.neighborhoodName ? `${property.neighborhoodName}, ` : ""}
            {property.city}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-secondary">
            {property.bedrooms ? <span>{property.bedrooms} {en ? "bed" : "ch."}</span> : null}
            {property.bathrooms ? <span>{property.bathrooms} {en ? "bath" : "sdb"}</span> : null}
            {property.livingArea ? <span>{property.livingArea} m²</span> : null}
            {property.landArea ? <span>{en ? "Land" : "Terrain"} {property.landArea} m²</span> : null}
            <span className="text-accent">{property.reference}</span>
          </div>
          <p className="font-display text-[28px] leading-none">{priceLabel(property, lang)}</p>
        </div>
      </div>
    </article>
  );
}
