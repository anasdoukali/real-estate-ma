"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PropertyCard, { priceLabel, type CardProperty } from "@/components/PropertyCard";
import { useCompare, useFavorites } from "@/lib/client-store";
import type { Lang } from "@/lib/i18n";
import { featureLabel } from "@/lib/site";

type Item = CardProperty & { features?: string[] };

export default function FavoritesClient({ lang, mode }: { lang: Lang; mode: "favorites" | "compare" }) {
  const en = lang === "en";
  const fav = useFavorites();
  const cmp = useCompare();
  const ids = mode === "favorites" ? fav.ids : cmp.ids;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!ids.length) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/properties?ids=${ids.join(",")}`);
      const data = await res.json();
      if (active) {
        setItems(data.items ?? []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="h-40 animate-pulse bg-stone" />;

  if (!items.length) {
    return (
      <div className="border border-stone bg-surface p-14 text-center">
        <p className="text-[15px] text-secondary">
          {mode === "favorites"
            ? en
              ? "You have no saved properties yet."
              : "Vous n'avez pas encore de biens favoris."
            : en
              ? "Add up to 3 properties to compare."
              : "Ajoutez jusqu'à 3 biens à comparer."}
        </p>
        <Link href="/biens" className="label-xs mt-8 inline-block bg-charcoal px-8 py-4 text-white hover:bg-ink">
          {en ? "Browse properties" : "Parcourir les biens"}
        </Link>
      </div>
    );
  }

  if (mode === "favorites") {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} lang={lang} />
        ))}
      </div>
    );
  }

  const rows: { label: string; render: (p: Item) => string }[] = [
    { label: en ? "Price" : "Prix", render: (p) => priceLabel(p, lang) },
    { label: en ? "Neighborhood" : "Quartier", render: (p) => p.neighborhoodName ?? "—" },
    { label: en ? "Living area" : "Surface", render: (p) => (p.livingArea ? `${p.livingArea} m²` : "—") },
    { label: en ? "Land" : "Terrain", render: (p) => (p.landArea ? `${p.landArea} m²` : "—") },
    { label: en ? "Bedrooms" : "Chambres", render: (p) => String(p.bedrooms ?? "—") },
    { label: en ? "Bathrooms" : "Salles de bain", render: (p) => String(p.bathrooms ?? "—") },
    {
      label: en ? "Features" : "Équipements",
      render: (p) => (p.features?.length ? p.features.map((f) => featureLabel(f, lang)).join(", ") : "—"),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse bg-surface text-[14px]">
        <thead>
          <tr>
            <th className="w-40 border border-stone p-4" />
            {items.map((p) => (
              <th key={p.id} className="border border-stone p-5 text-left align-top">
                <Link href={`/biens/${p.slug}`} className="font-display text-[22px] hover:text-accent">
                  {en ? p.titleEn || p.titleFr : p.titleFr}
                </Link>
                <button
                  onClick={() => cmp.remove(p.id)}
                  className="label-xs mt-3 block text-secondary hover:text-accent"
                >
                  {en ? "Remove" : "Retirer"}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="label-xs border border-stone bg-page p-4 text-secondary">{r.label}</td>
              {items.map((p) => (
                <td key={p.id} className="border border-stone p-4">
                  {r.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
