import type { Metadata } from "next";
import NeighborhoodExplorer from "@/components/site/NeighborhoodExplorer";
import { getLang } from "@/lib/lang";
import { listNeighborhoods } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quartiers de Marrakech — Palmeraie, Hivernage, Guéliz, Amelkis",
  description: "Découvrez les quartiers les plus recherchés de Marrakech et les biens disponibles.",
};

export default async function NeighborhoodsPage() {
  const lang = await getLang();
  const en = lang === "en";
  const hoods = await loadPublicData(() => listNeighborhoods(), []);

  return (
    <>
      <section className="bg-charcoal pb-20 pt-[150px] text-white md:pt-[190px]">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <p className="label-xs text-accent">Marrakech</p>
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

      <section className="bg-white">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
          <NeighborhoodExplorer neighborhoods={hoods} lang={lang} />
        </div>
      </section>
    </>
  );
}
