import type { Metadata } from "next";
import FavoritesClient from "@/components/site/FavoritesClient";
import { getLang } from "@/lib/lang";

export const metadata: Metadata = { title: "Comparer des biens" };

export default async function ComparePage() {
  const lang = await getLang();
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-24 pt-[140px] md:px-10 md:pt-[180px]">
      <p className="label-xs text-champagne">{lang === "en" ? "Comparison" : "Comparaison"}</p>
      <h1 className="display mt-5 text-[38px] sm:text-[54px]">
        {lang === "en" ? "Compare properties" : "Comparer les biens"}
      </h1>
      <div className="mt-14">
        <FavoritesClient lang={lang} mode="compare" />
      </div>
    </section>
  );
}
