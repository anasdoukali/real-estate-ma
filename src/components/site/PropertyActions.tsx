"use client";

import type { Lang } from "@/lib/i18n";
import { useCompare, useFavorites } from "@/lib/client-store";

export default function PropertyActions({ id, lang }: { id: number; lang: Lang }) {
  const en = lang === "en";
  const { ids, toggle } = useFavorites();
  const { ids: cmp, toggle: toggleCmp } = useCompare();
  const isFav = ids.includes(id);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url, title: document.title });
        return;
      } catch {
        /* ignore */
      }
    }
    await navigator.clipboard.writeText(url);
    alert(en ? "Link copied" : "Lien copié");
  }

  return (
    <div className="flex flex-wrap items-center gap-6 text-[13px]">
      <button onClick={() => toggle(id)} className={`flex items-center gap-2 ${isFav ? "text-champagne" : "hover:text-champagne"}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
          <path d="M12 21s-7.5-4.6-9.5-9A5.3 5.3 0 0 1 12 6.5 5.3 5.3 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9z" />
        </svg>
        {en ? "Favorite" : "Favoris"}
      </button>
      <button
        onClick={() => toggleCmp(id)}
        className={`flex items-center gap-2 ${cmp.includes(id) ? "text-champagne" : "hover:text-champagne"}`}
      >
        ⇄ {en ? "Compare" : "Comparer"}
      </button>
      <button onClick={share} className="hover:text-champagne">
        {en ? "Share" : "Partager"}
      </button>
      <button onClick={() => window.print()} className="hover:text-champagne">
        {en ? "Print" : "Imprimer"}
      </button>
    </div>
  );
}
