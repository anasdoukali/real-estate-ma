import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { listArticles } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le journal — marché immobilier de Marrakech",
  description: "Analyses, guides et tendances du marché immobilier marrakchi.",
};

export default async function BlogPage() {
  const lang = await getLang();
  const en = lang === "en";
  const items = await loadPublicData(() => listArticles(true, 24), []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-[140px] md:px-10 md:pt-[180px]">
      <p className="label-xs text-accent">{en ? "Market insights" : "Le journal"}</p>
      <h1 className="display mt-5 max-w-2xl text-[40px] sm:text-[58px]">
        {en ? (
          <>
            The market,
            <br />
            decoded.
          </>
        ) : (
          <>
            Le marché,
            <br />
            décrypté.
          </>
        )}
      </h1>

      <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {items.map((a, i) => (
          <Reveal key={a.id} delay={(i % 3) * 70}>
            <Link href={`/blog/${a.slug}`} className="group block">
              <div className="relative aspect-[3/2] overflow-hidden bg-stone">
                {a.coverImage && (
                  <Image
                    src={a.coverImage}
                    alt={a.titleFr}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <p className="label-xs mt-6 text-accent">{a.category}</p>
              <h2 className="mt-3 font-display text-[27px] leading-tight group-hover:text-accent">
                {pick(lang, a.titleFr, a.titleEn)}
              </h2>
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-secondary">
                {pick(lang, a.excerptFr, a.excerptEn)}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
      {items.length === 0 && <p className="py-24 text-secondary">{en ? "No article yet." : "Aucun article pour le moment."}</p>}
      </div>
    </section>
  );
}
