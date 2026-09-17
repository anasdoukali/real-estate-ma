import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPanel from "@/components/site/SearchPanel";
import ListingResults from "@/components/site/ListingResults";
import { getLang } from "@/lib/lang";
import { countProperties, listNeighborhoods, listProperties, type PropertyFilters } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";
import { toCard, toPoint } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Propriétés à Marrakech — villas, riads & appartements",
  description:
    "Recherchez parmi nos villas, riads, appartements et terrains à vendre ou à louer à Marrakech.",
};

type SP = Record<string, string | string[] | undefined>;

export function parseFilters(sp: SP): PropertyFilters {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const num = (k: string) => {
    const v = one(k);
    const n = v ? Number(v) : undefined;
    return n && !Number.isNaN(n) ? n : undefined;
  };
  const featuresRaw = sp["features"];
  return {
    transaction: one("transaction"),
    type: one("type"),
    neighborhood: one("neighborhood"),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    bedrooms: num("bedrooms"),
    bathrooms: num("bathrooms"),
    minSurface: num("minSurface"),
    maxSurface: num("maxSurface"),
    reference: one("reference"),
    features: Array.isArray(featuresRaw) ? featuresRaw : featuresRaw ? [featuresRaw] : undefined,
    sort: one("sort"),
  };
}

export default async function BiensPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const lang = await getLang();
  const en = lang === "en";
  const filters = parseFilters(sp);
  const [items, total, hoods] = await Promise.all([
    loadPublicData(() => listProperties({ ...filters, limit: 48 }), []),
    loadPublicData(() => countProperties(filters), 0),
    loadPublicData(() => listNeighborhoods(), []),
  ]);

  return (
    <>
      <section className="relative bg-charcoal pb-16 pt-[150px] text-white md:pt-[190px]">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <p className="label-xs text-accent">Marrakech</p>
          <h1 className="display mt-5 text-[38px] sm:text-[54px]">
            {en ? "Properties in Marrakech" : "Propriétés à Marrakech"}
          </h1>
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-[1600px] px-5 md:mt-10 md:px-10">
        <SearchPanel
          lang={lang}
          variant="bar"
          neighborhoods={hoods.map((n) => ({ name: n.name, slug: n.slug }))}
          defaults={{
            transaction: filters.transaction ?? "sale",
            type: filters.type ?? "",
            neighborhood: filters.neighborhood ?? "",
            maxPrice: filters.maxPrice ? String(filters.maxPrice) : "",
            minPrice: filters.minPrice ? String(filters.minPrice) : "",
            bedrooms: filters.bedrooms ? String(filters.bedrooms) : "",
            bathrooms: filters.bathrooms ? String(filters.bathrooms) : "",
            minSurface: filters.minSurface ? String(filters.minSurface) : "",
            maxSurface: filters.maxSurface ? String(filters.maxSurface) : "",
            reference: filters.reference ?? "",
            features: filters.features ?? [],
          }}
        />
      </div>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
        <Suspense fallback={<div className="h-40" />}>
          <ListingResults
            items={items.map(toCard)}
            points={items.map((p) => toPoint(p, lang))}
            lang={lang}
            total={total}
          />
        </Suspense>
      </section>
    </>
  );
}
