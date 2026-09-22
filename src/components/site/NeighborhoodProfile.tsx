import { NEIGHBORHOOD_RATINGS, NEIGHBORHOOD_TRAITS, type NeighborhoodProfile as Profile } from "@/lib/neighborhood-profile";
import type { Lang } from "@/lib/i18n";

export default function NeighborhoodProfile({ profile, lang }: { profile: Profile | null; lang: Lang }) {
  if (!profile) return null;
  const ratings = NEIGHBORHOOD_RATINGS.filter(({ key }) => {
    const value = profile.ratings?.[key];
    return Number.isInteger(value) && value! >= 1 && value! <= 5;
  });
  const traits = NEIGHBORHOOD_TRAITS.filter(({ key }) => profile.traits?.[key]?.[lang] || profile.traits?.[key]?.fr || profile.traits?.[key]?.en);
  if (!ratings.length && !traits.length) return null;
  const en = lang === "en";
  return (
    <section className="mt-8">
      <h2 className="label-xs font-bold text-accent">{en ? "Our analysis :" : "Notre analyse :"}</h2>
      <dl className="mt-6 divide-y divide-charcoal/10 border border-charcoal/15 bg-warm p-6 sm:p-8">
        {ratings.slice(0, 6).map(renderRating)}
        {traits.map(({ key, fr, en: labelEn }) => (
          <div key={key} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 py-3 text-[14px]">
            <dt>{en ? labelEn : fr}</dt>
            <dd className="font-medium">{profile.traits?.[key]?.[lang] || profile.traits?.[key]?.fr || profile.traits?.[key]?.en}</dd>
          </div>
        ))}
        {ratings.slice(6).map(renderRating)}
      </dl>
    </section>
  );

  function renderRating({ key, fr, en: labelEn }: (typeof NEIGHBORHOOD_RATINGS)[number]) {
    const value = profile!.ratings![key]!;
    return (
      <div key={key} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 text-[14px]">
        <dt>{en ? labelEn : fr}</dt>
        <dd aria-label={en ? value + " out of 5" : value + " sur 5"} className="whitespace-nowrap text-[20px] tracking-[0.08em] text-champagne">
          <span aria-hidden="true">{"★".repeat(value)}{"☆".repeat(5 - value)}</span>
        </dd>
      </div>
    );
  }
}
