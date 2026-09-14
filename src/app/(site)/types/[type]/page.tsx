import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import SearchPanel from "@/components/site/SearchPanel";
import { getLang } from "@/lib/lang";
import { countProperties, listNeighborhoods, listProperties } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";
import { toCard } from "@/lib/mappers";
import { PROPERTY_TYPES, propertyTypePlural } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const found = PROPERTY_TYPES.find((t) => t.value === type);
  if (!found) return { title: "Type introuvable" };
  return {
    title: `${found.plural_fr} à vendre et à louer à Marrakech`,
    description: `Découvrez notre sélection de ${found.plural_fr.toLowerCase()} à Marrakech.`,
    alternates: { canonical: `/types/${type}` },
  };
}

export default async function TypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const lang = await getLang();
  const en = lang === "en";
  const found = PROPERTY_TYPES.find((t) => t.value === type);
  if (!found) notFound();

  const [items, total, hoods] = await Promise.all([
    loadPublicData(() => listProperties({ type, limit: 36 }), []),
    loadPublicData(() => countProperties({ type }), 0),
    loadPublicData(() => listNeighborhoods(), []),
  ]);

  return (
    <>
      <section className="bg-charcoal pb-20 pt-[150px] text-white md:pt-[190px]">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <p className="label-xs text-champagne">Collection</p>
          <h1 className="display mt-5 text-[40px] sm:text-[60px]">{propertyTypePlural(type, lang)}</h1>
          <p className="mt-5 text-[14px] text-white/60">
            {total} {en ? "properties available in Marrakech" : "biens disponibles à Marrakech"}
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-[1600px] px-5 md:px-10">
        <SearchPanel
          lang={lang}
          variant="bar"
          neighborhoods={hoods.map((n) => ({ name: n.name, slug: n.slug }))}
          defaults={{ type }}
        />
      </div>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={toCard(p)} lang={lang} />
          ))}
        </div>
        {items.length === 0 && (
          <p className="py-24 text-center text-muted">
            {en ? "No property available yet in this category." : "Aucun bien disponible dans cette catégorie."}
          </p>
        )}
      </section>
    </>
  );
}
