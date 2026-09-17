import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import SingleMap from "@/components/site/SingleMap";
import Reveal from "@/components/Reveal";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { countProperties, getNeighborhoodBySlug, listProperties } from "@/lib/queries";
import { toCard, toPoint } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hood = await getNeighborhoodBySlug(slug);
  if (!hood) return { title: "Quartier introuvable" };
  const title = `Immobilier à ${hood.name}, Marrakech`;
  const description = (hood.descriptionFr ?? "").slice(0, 180);
  const images = hood.coverImage ? [hood.coverImage] : [];
  return {
    title,
    description,
    alternates: { canonical: `/quartiers/${hood.slug}` },
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const en = lang === "en";
  const hood = await getNeighborhoodBySlug(slug);
  if (!hood || !hood.published) notFound();

  const [items, total] = await Promise.all([
    listProperties({ neighborhood: hood.slug, limit: 12 }),
    countProperties({ neighborhood: hood.slug }),
  ]);

  const avgPrice =
    items.length > 0
      ? Math.round(items.reduce((sum, p) => sum + Number(p.price), 0) / items.length)
      : 0;

  return (
    <>
      <section className="relative h-[70vh] min-h-[440px] w-full overflow-hidden">
        {hood.coverImage && (
          <Image src={hood.coverImage} alt={hood.name} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10">
          <p className="label-xs text-white/70">Marrakech</p>
          <h1 className="display mt-4 text-[46px] text-white sm:text-[76px]">{hood.name}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[60%_40%]">
          <Reveal>
            <p className="label-xs text-accent">{en ? "The area" : "Le quartier"}</p>
            <p className="mt-6 whitespace-pre-line text-[16.5px] leading-[1.9] text-ink/85">
              {pick(lang, hood.descriptionFr, hood.descriptionEn)}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-px bg-sand">
              <div className="bg-page p-8">
                <p className="font-display text-[40px] leading-none text-accent">{total}</p>
                <p className="label-xs mt-3 text-secondary">{en ? "Available listings" : "Biens disponibles"}</p>
              </div>
              <div className="bg-page p-8">
                <p className="font-display text-[40px] leading-none text-accent">
                  {avgPrice ? `${Math.round(avgPrice / 1_000_000)}M` : "—"}
                </p>
                <p className="label-xs mt-3 text-secondary">{en ? "Average price MAD" : "Prix moyen MAD"}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {items.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-20 md:px-10">
          <h2 className="display text-[30px] sm:text-[42px]">
            {en ? `Properties in ${hood.name}` : `Biens à ${hood.name}`}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PropertyCard key={p.id} property={toCard(p)} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="overflow-hidden border border-stone">
          <SingleMap
            points={items.map((p) => toPoint(p, lang))}
            center={
              hood.latitude && hood.longitude ? { lat: hood.latitude, lng: hood.longitude } : undefined
            }
            zoom={13}
            height={520}
          />
        </div>
      </section>
    </>
  );
}
