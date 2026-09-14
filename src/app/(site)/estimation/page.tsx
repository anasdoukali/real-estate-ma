import type { Metadata } from "next";
import ValuationForm from "@/components/site/ValuationForm";
import { getLang } from "@/lib/lang";
import { listNeighborhoods } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estimation gratuite de votre bien à Marrakech",
  description: "Recevez une estimation personnalisée réalisée par un spécialiste du marché marrakchi.",
};

export default async function ValuationPage() {
  const lang = await getLang();
  const en = lang === "en";
  const hoods = await loadPublicData(() => listNeighborhoods(), []);

  return (
    <>
      <section className="bg-charcoal pb-24 pt-[150px] text-white md:pt-[190px]">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <p className="label-xs text-champagne">{en ? "Valuation" : "Estimation"}</p>
          <h1 className="display mt-5 max-w-3xl text-[38px] sm:text-[58px]">
            {en ? "What is your property worth in Marrakech?" : "Quelle est la valeur de votre bien à Marrakech ?"}
          </h1>
          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/65">
            {en
              ? "Four quick steps. A specialist analyses your property and comes back with a personalised valuation."
              : "Quatre étapes rapides. Un spécialiste analyse votre bien et revient vers vous avec une estimation personnalisée."}
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-14 max-w-[1200px] px-5 pb-24 md:px-10">
        <ValuationForm lang={lang} neighborhoods={hoods.map((n) => ({ name: n.name, slug: n.slug }))} />
      </section>
    </>
  );
}
