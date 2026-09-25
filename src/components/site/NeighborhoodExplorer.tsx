"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { pick, type Lang } from "@/lib/i18n";
import { PRICE_LEVELS, PRICE_LEVELS_EN, type NeighborhoodProfile } from "@/lib/neighborhood-profile";

type Hood = { id: number; name: string; slug: string; coverImage: string | null; descriptorFr: string | null; descriptorEn: string | null; propertyCount: number; profile: NeighborhoodProfile | null };
export default function NeighborhoodExplorer({ neighborhoods, lang }: { neighborhoods: Hood[]; lang: Lang }) {
  const en = lang === "en";
  const prices = en ? PRICE_LEVELS_EN : PRICE_LEVELS;
  const [budget, setBudget] = useState("");
  const [standing, setStanding] = useState("");
  const [sort, setSort] = useState("");
  const visible = neighborhoods.filter((h) => (!budget || h.profile?.priceLevel === Number(budget)) && (!standing || (h.profile?.ratings?.prestige ?? 0) >= Number(standing)));
  if (sort) visible.sort((a, b) => {
    const av = sort === "standing" ? a.profile?.ratings?.prestige : a.profile?.priceLevel;
    const bv = sort === "standing" ? b.profile?.ratings?.prestige : b.profile?.priceLevel;
    if (av === undefined) return bv === undefined ? 0 : 1;
    if (bv === undefined) return -1;
    return sort === "asc" ? av - bv : bv - av;
  });
  function reset() { setBudget(""); setStanding(""); setSort(""); }
  const control = "mt-2 h-12 w-full border border-sand bg-white px-3 text-[14px] text-charcoal focus:outline-charcoal";
  return <div>
    <div className="mb-8 border border-charcoal/15 bg-warm p-6">
      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-[13px] font-semibold">{en ? "Budget / price level" : "Budget / niveau de prix"}
          <select className={control} value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="">{en ? "All budgets" : "Tous les budgets"}</option>
            {prices.map((label, i) => <option key={label} value={i + 1}>{i + 1}/5 — {label}</option>)}
          </select>
        </label>
        <label className="text-[13px] font-semibold">{en ? "Minimum standing" : "Standing minimum"}
          <select className={control} value={standing} onChange={(e) => setStanding(e.target.value)}>
            <option value="">{en ? "All levels" : "Tous les niveaux"}</option>
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}/5 {en ? "and above" : "et plus"}</option>)}
          </select>
        </label>
        <label className="text-[13px] font-semibold">{en ? "Sort by" : "Trier par"}
          <select className={control} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">{en ? "Agency selection" : "Sélection de l’agence"}</option>
            <option value="asc">{en ? "Price: low to high" : "Prix croissant"}</option>
            <option value="desc">{en ? "Price: high to low" : "Prix décroissant"}</option>
            <option value="standing">{en ? "Standing: high to low" : "Standing décroissant"}</option>
          </select>
        </label>
        <button onClick={reset} className="h-12 border border-charcoal px-4 text-[13px] hover:bg-charcoal hover:text-white">{en ? "Reset" : "Réinitialiser"}</button>
      </div>
      <p className="mt-5 text-[12px] text-muted">{en ? "Agency assessment · Price: 1 = affordable, 5 = very high. Standing out of 5, separate from customer reviews." : "Évaluation de notre agence · Prix : 1 = accessible, 5 = très élevé. Standing sur 5, distinct des avis clients."}</p>
    </div>
    <p role="status" className="mb-6 text-[14px]">{visible.length} {en ? "neighborhood(s)" : "quartier(s)"}</p>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((h) => {
        const price = h.profile?.priceLevel;
        const rating = h.profile?.ratings?.prestige;
        return <Link key={h.id} href={"/quartiers/" + h.slug} className="group block overflow-hidden bg-warm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal">
          <div className="relative h-[300px] overflow-hidden bg-charcoal">
            {h.coverImage && <Image src={h.coverImage} alt={h.name} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="font-display text-[32px] leading-none">{h.name}</p>
              <p className="mt-3 line-clamp-2 text-[13px] text-white/80">{pick(lang, h.descriptorFr, h.descriptorEn)}</p>
              <p className="label-xs mt-4 text-white/80">{h.propertyCount} {en ? "listings" : "biens"}</p>
            </div>
          </div>
          <div className="space-y-3 bg-[#ded5c7] p-5 text-[14px]">
            <div className="flex flex-wrap justify-between gap-2"><span>{en ? "Price level" : "Niveau de prix"}</span><span className="font-semibold">{price ? prices[price - 1] + " · " + price + "/5" : en ? "Not rated" : "Non renseigné"}</span></div>
            <div className="flex flex-wrap items-center justify-between gap-2"><span>Standing</span>{rating ? <span aria-label={rating + "/5"} className="text-[20px] tracking-wider text-champagne"><span aria-hidden="true">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span></span> : <span>{en ? "Not rated" : "Non renseigné"}</span>}</div>
          </div>
        </Link>;
      })}
    </div>
    {!visible.length && <div className="bg-warm p-10 text-center"><p>{en ? "No neighborhoods match these criteria." : "Aucun quartier ne correspond à ces critères."}</p><button onClick={reset} className="mt-4 underline">{en ? "Show all neighborhoods" : "Voir tous les quartiers"}</button></div>}
  </div>;
}
