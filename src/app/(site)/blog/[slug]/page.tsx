import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getArticleBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  const title = article.titleFr;
  const description = (article.excerptFr ?? "").slice(0, 180);
  const images = article.coverImage ? [article.coverImage] : [];
  return {
    title,
    description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== "published") notFound();

  return (
    <article className="pb-24">
      <div className="relative h-[58vh] min-h-[360px] w-full overflow-hidden">
        {article.coverImage && (
          <Image src={article.coverImage} alt={article.titleFr} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="relative mx-auto flex h-full max-w-[1100px] flex-col justify-end px-5 pb-14 md:px-10">
          <p className="label-xs text-champagne">{article.category}</p>
          <h1 className="display mt-4 text-[34px] text-white sm:text-[52px]">{pick(lang, article.titleFr, article.titleEn)}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-[820px] px-5 pt-16 md:px-0">
        <p className="font-display text-[24px] leading-[1.5] text-ink/85">{pick(lang, article.excerptFr, article.excerptEn)}</p>
        <div className="mt-10 whitespace-pre-line text-[17px] leading-[1.95] text-ink/80">
          {pick(lang, article.contentFr, article.contentEn)}
        </div>
      </div>
    </article>
  );
}
