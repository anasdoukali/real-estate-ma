"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { MapPoint } from "./PropertyMap";
import type { Lang } from "@/lib/i18n";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-[680px] w-full animate-pulse bg-stone" />,
});

export default function HomeMapSection({ points, lang }: { points: MapPoint[]; lang: Lang }) {
  const en = lang === "en";
  const [transaction, setTransaction] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [active, setActive] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      points.filter(
        (p) =>
          (transaction === "all" || p.transactionType === transaction) &&
          (type === "all" || p.propertyType === type),
      ),
    [points, transaction, type],
  );

  const chips = [
    { key: "transaction", value: "all", label: en ? "All" : "Tous" },
    { key: "transaction", value: "sale", label: en ? "Buy" : "Acheter" },
    { key: "transaction", value: "rent", label: en ? "Rent" : "Louer" },
  ];
  const typeChips = [
    { value: "all", label: en ? "All types" : "Tous types" },
    { value: "villa", label: "Villa" },
    { value: "appartement", label: en ? "Apartment" : "Appartement" },
    { value: "riad", label: "Riad" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.value}
            onClick={() => setTransaction(c.value)}
            className={`label-xs border px-5 py-3 transition-colors ${
              transaction === c.value
                ? "border-charcoal bg-charcoal text-white"
                : "border-sand text-secondary hover:border-charcoal hover:text-charcoal"
            }`}
          >
            {c.label}
          </button>
        ))}
        <span className="mx-2 hidden w-px bg-sand md:block" />
        {typeChips.map((c) => (
          <button
            key={c.value}
            onClick={() => setType(c.value)}
            className={`label-xs border px-5 py-3 transition-colors ${
              type === c.value
                ? "border-champagne bg-champagne text-charcoal"
                : "border-sand text-secondary hover:border-champagne hover:text-charcoal"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="overflow-hidden border border-stone">
        <PropertyMap points={filtered} activeId={active} onSelect={setActive} height={700} />
      </div>
    </div>
  );
}
