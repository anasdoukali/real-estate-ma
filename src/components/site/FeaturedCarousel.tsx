"use client";

import { useRef } from "react";
import PropertyCard, { type CardProperty } from "@/components/PropertyCard";
import type { Lang } from "@/lib/i18n";

export default function FeaturedCarousel({ items, lang }: { items: CardProperty[]; lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);

  function scrollBy(dir: number) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.42), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 pl-5 pr-5 md:pl-10 md:pr-10"
      >
        {items.map((p) => (
          <div key={p.id} className="w-[86vw] shrink-0 snap-start sm:w-[62vw] lg:w-[30vw] xl:w-[27vw]">
            <PropertyCard property={p} lang={lang} />
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-3 px-5 md:px-10">
        <button
          onClick={() => scrollBy(-1)}
          aria-label="previous"
          className="flex h-12 w-12 items-center justify-center border border-sand text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="next"
          className="flex h-12 w-12 items-center justify-center border border-sand text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
