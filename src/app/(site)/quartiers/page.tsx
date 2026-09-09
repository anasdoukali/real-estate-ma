import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { listNeighborhoods } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quartiers de Marrakech — Palmeraie, Hivernage, Guéliz, Amelkis",
  description: "Découvrez les quartiers les plus recherchés de Marrakech et les biens disponibles.",
};

export default async function NeighborhoodsPage() {
  const lang = await getLang();
  const en = lang === "en";
  const hoods = await listNeighborhoods();

  return (
    <>
      <section className="bg-charcoal pb-20 pt-[150px] text-white md:pt-[190px]">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <p className="label-xs text-champagne">Marrakech</p>
          <h1 className="display mt-5 max-w-3xl text-[38px] sm:text-[58px]">
            {en ? "The neighborhoods of Marrakech" : "Les quartiers de Marrakech"}
          </h1>
          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/65">
            {en
              ? "Each address has its own atmosphere. Explore our guide to the city's most sought-after districts."
              : "Chaque adresse possède son atmosphère. Explorez notre guide des quartiers les plus recherchés de la ville."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hoods.map((h, i) => (
            <Reveal key={h.id} delay={(i % 3) * 70}>
              <Link href={`/quartiers/${h.slug}`} className="group relative block h-[360px] overflow-hidden">
                {h.coverImage && (
                  <Image
                    src={h.coverImage}
                    alt={h.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <p className="font-display text-[32px] leading-none">{h.name}</p>
                  <p className="mt-3 line-clamp-2 text-[13px] text-white/70">
                    {pick(lang, h.descriptorFr, h.descriptorEn)}
                  </p>
                  <p className="label-xs mt-4 text-champagne">
                    {h.propertyCount} {en ? "listings" : "biens"}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
