"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { FEATURES, PROPERTY_TYPES } from "@/lib/site";

export type SearchDefaults = {
  transaction?: string;
  type?: string;
  neighborhood?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  minSurface?: string;
  maxSurface?: string;
  reference?: string;
  features?: string[];
};

const SALE_BUDGETS = [1_000_000, 2_000_000, 3_000_000, 5_000_000, 8_000_000, 12_000_000, 20_000_000];
const RENT_BUDGETS = [5_000, 10_000, 15_000, 25_000, 40_000, 60_000, 100_000];

const inputCls =
  "h-12 w-full rounded-[20px] border border-sand bg-white px-3 text-[13.5px] text-charcoal outline-none transition-colors focus:border-champagne";

export default function SearchPanel({
  lang,
  neighborhoods,
  defaults = {},
  variant = "hero",
}: {
  lang: Lang;
  neighborhoods: { name: string; slug: string }[];
  defaults?: SearchDefaults;
  variant?: "hero" | "bar";
}) {
  const router = useRouter();
  const en = lang === "en";
  const [transaction, setTransaction] = useState(defaults.transaction ?? "sale");
  const [advanced, setAdvanced] = useState(false);
  const [features, setFeatures] = useState<string[]>(defaults.features ?? []);
  const [form, setForm] = useState({
    type: defaults.type ?? "",
    neighborhood: defaults.neighborhood ?? "",
    minPrice: defaults.minPrice ?? "",
    maxPrice: defaults.maxPrice ?? "",
    bedrooms: defaults.bedrooms ?? "",
    bathrooms: defaults.bathrooms ?? "",
    minSurface: defaults.minSurface ?? "",
    maxSurface: defaults.maxSurface ?? "",
    reference: defaults.reference ?? "",
  });

  const budgets = transaction === "rent" ? RENT_BUDGETS : SALE_BUDGETS;

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("transaction", transaction);
    Object.entries(form).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    features.forEach((f) => params.append("features", f));
    router.push(`/biens?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className={`w-full overflow-hidden rounded-[20px] bg-warm shadow-[0_24px_70px_-30px_rgba(22,22,22,0.45)] ${
        variant === "hero" ? "" : "border border-stone"
      }`}
    >
      <div className="flex flex-wrap">
        {[
          { value: "sale", label: en ? "Sale" : "Vente" },
          { value: "rent", label: en ? "Rental" : "Location" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setTransaction(tab.value)}
            className={`search-transaction-tab label-xs px-8 py-4 transition-colors ${
              transaction === tab.value ? "bg-warm text-charcoal" : "bg-charcoal/90 text-white/70 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <Link href="/home-staging" className="search-transaction-tab label-xs bg-charcoal/90 px-5 py-4 text-white/70 transition-colors hover:text-white">Home Staging</Link>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <select aria-label={en ? "Sale or rental" : "Vente ou location"} className={inputCls} value={transaction} onChange={e => setTransaction(e.target.value)}>
            <option value="sale">{en ? "Sale" : "Vente"}</option>
            <option value="rent">{en ? "Rental" : "Location"}</option>
          </select>
          <select className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="">{en ? "Property type" : "Type de bien"}</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {en ? t.en : t.fr}
              </option>
            ))}
          </select>

          <select
            className={inputCls}
            value={form.neighborhood}
            onChange={(e) => set("neighborhood", e.target.value)}
          >
            <option value="">{en ? "Neighborhood" : "Quartier"}</option>
            {neighborhoods.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>

          <select className={inputCls} value={form.maxPrice} onChange={(e) => set("maxPrice", e.target.value)}>
            <option value="">{en ? "Desired budget" : "Budget souhaité"}</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {en ? "Up to" : "Jusqu'à"} {new Intl.NumberFormat("fr-FR").format(b)} MAD
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="label-xs h-12 rounded-[20px] bg-charcoal px-6 text-white transition-colors hover:bg-champagne"
          >
            {en ? "Search" : "Rechercher"}
          </button>
        </div>

        <div
          className={`grid overflow-hidden transition-all duration-500 ${
            advanced ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="grid gap-3 border-t border-sand pt-5 md:grid-cols-3 lg:grid-cols-5">
              <select aria-label={en ? "Bedrooms" : "Chambres"} className={inputCls} value={form.bedrooms} onChange={e => set("bedrooms", e.target.value)}>
                <option value="">{en ? "Bedrooms" : "Chambres"}</option>
                {[1, 2, 3, 4, 5, 6].map(b => <option key={b} value={b}>{b}+</option>)}
              </select>
              <input
                className={inputCls}
                placeholder={en ? "Reference" : "Référence"}
                value={form.reference}
                onChange={(e) => set("reference", e.target.value)}
              />
              <select className={inputCls} value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)}>
                <option value="">{en ? "Bathrooms" : "Salles de bain"}</option>
                {[1, 2, 3, 4, 5].map((b) => (
                  <option key={b} value={b}>
                    {b}+
                  </option>
                ))}
              </select>
              <input
                className={inputCls}
                type="number"
                placeholder={en ? "Min surface m²" : "Surface min m²"}
                value={form.minSurface}
                onChange={(e) => set("minSurface", e.target.value)}
              />
              <input
                className={inputCls}
                type="number"
                placeholder={en ? "Max surface m²" : "Surface max m²"}
                value={form.maxSurface}
                onChange={(e) => set("maxSurface", e.target.value)}
              />
              <input
                className={inputCls}
                type="number"
                placeholder={en ? "Min price" : "Prix min"}
                value={form.minPrice}
                onChange={(e) => set("minPrice", e.target.value)}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {FEATURES.slice(0, 10).map((f) => {
                const active = features.includes(f.value);
                return (
                  <button
                    type="button"
                    key={f.value}
                    onClick={() =>
                      setFeatures((prev) =>
                        prev.includes(f.value) ? prev.filter((x) => x !== f.value) : [...prev, f.value],
                      )
                    }
                    className={`rounded-[20px] border px-3.5 py-2 text-[12px] transition-colors ${
                      active
                        ? "border-champagne bg-champagne text-white"
                        : "border-sand bg-white text-muted hover:border-champagne hover:text-charcoal"
                    }`}
                  >
                    {en ? f.en : f.fr}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAdvanced((a) => !a)}
          className="label-xs mt-5 flex items-center gap-2 text-champagne transition-opacity hover:opacity-70"
        >
          <span>{advanced ? (en ? "Fewer filters" : "Moins de critères") : en ? "More filters" : "+ Plus de critères"}</span>
        </button>
        <Link href="/confiez-nous-votre-bien" className="label-xs mt-5 inline-block text-charcoal underline underline-offset-4">{en ? "List your property" : "Confiez-nous votre bien"} →</Link>
      </div>
    </form>
  );
}
