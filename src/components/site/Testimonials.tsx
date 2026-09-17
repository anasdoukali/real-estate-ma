"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { pick } from "@/lib/i18n";

export type TestimonialItem = {
  id: number;
  quoteFr: string;
  quoteEn: string | null;
  authorName: string;
  detail: string | null;
};

export default function Testimonials({ items, lang }: { items: TestimonialItem[]; lang: Lang }) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const current = items[index % items.length];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-9">
        <p className="font-display text-[30px] leading-[1.22] text-charcoal sm:text-[42px] lg:text-[54px]">
          “{pick(lang, current.quoteFr, current.quoteEn)}”
        </p>
        <div className="mt-10">
          <p className="text-[15px] font-semibold tracking-[0.01em]">{current.authorName}</p>
          {current.detail && <p className="label-xs mt-2 text-accent">{current.detail}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 lg:col-span-3 lg:justify-end">
        <span className="mr-4 text-[12px] text-secondary">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button
          onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
          aria-label="previous"
          className="flex h-12 w-12 items-center justify-center border border-sand transition-colors hover:bg-charcoal hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => setIndex((i) => (i + 1) % items.length)}
          aria-label="next"
          className="flex h-12 w-12 items-center justify-center border border-sand transition-colors hover:bg-charcoal hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
