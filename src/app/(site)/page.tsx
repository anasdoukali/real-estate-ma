import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PropertyCard from "@/components/PropertyCard";
import SearchPanel from "@/components/site/SearchPanel";
import FeaturedCarousel from "@/components/site/FeaturedCarousel";
import HomeMapSection from "@/components/site/HomeMapSection";
import Testimonials from "@/components/site/Testimonials";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { PROPERTY_TYPES, propertyTypePlural } from "@/lib/site";
import {
  getSettings,
  listAgents,
  listArticles,
  listNeighborhoods,
  listProperties,
  listTestimonials,
  typeCounts,
} from "@/lib/queries";
import { toCard, toPoint } from "@/lib/mappers";

const HERO_IMAGE =
  "https://images.pexels.com/photos/12715498/pexels-photo-12715498.jpeg?auto=compress&cs=tinysrgb&w=2400";
const MARRAKECH_IMAGE =
  "https://images.pexels.com/photos/38891222/pexels-photo-38891222.jpeg?auto=compress&cs=tinysrgb&w=2000";
const STATS_IMAGE =
  "https://images.pexels.com/photos/15260622/pexels-photo-15260622.jpeg?auto=compress&cs=tinysrgb&w=1600";
const VALUATION_IMAGE =
  "https://images.pexels.com/photos/8134745/pexels-photo-8134745.jpeg?auto=compress&cs=tinysrgb&w=1600";
const COLLECTION_IMAGES: Record<string, string> = {
  villa: "https://images.pexels.com/photos/9730025/pexels-photo-9730025.jpeg?auto=compress&cs=tinysrgb&w=1200",
  appartement: "https://images.pexels.com/photos/7005300/pexels-photo-7005300.jpeg?auto=compress&cs=tinysrgb&w=1200",
  riad: "https://images.pexels.com/photos/10573397/pexels-photo-10573397.jpeg?auto=compress&cs=tinysrgb&w=1200",
  maison: "https://images.pexels.com/photos/6283965/pexels-photo-6283965.jpeg?auto=compress&cs=tinysrgb&w=1200",
  terrain: "https://images.pexels.com/photos/38787221/pexels-photo-38787221.jpeg?auto=compress&cs=tinysrgb&w=1200",
  bureau: "https://images.pexels.com/photos/8484851/pexels-photo-8484851.jpeg?auto=compress&cs=tinysrgb&w=1200",
  commerce: "https://images.pexels.com/photos/2610815/pexels-photo-2610815.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const lang = await getLang();
  const en = lang === "en";
  const [settings, hoods, featured, latest, mapProps, agentList, articleList, quotes, counts] = await Promise.all([
    getSettings(),
    listNeighborhoods(),
    listProperties({ featured: true, limit: 9 }),
    listProperties({ limit: 6 }),
    listProperties({ limit: 60 }),
    listAgents(),
    listArticles(true, 3),
    listTestimonials(),
    typeCounts(),
  ]);

  const services = [
    {
      n: "01",
      fr: "Acheter",
      en: "Buy",
      dfr: "Une sélection personnalisée et un accompagnement complet jusqu'à la signature.",
      den: "A personalised selection and full guidance all the way to signature.",
      href: "/biens?transaction=sale",
    },
    {
      n: "02",
      fr: "Vendre",
      en: "Sell",
      dfr: "Estimation, mise en valeur et commercialisation de votre propriété.",
      den: "Valuation, staging and marketing of your property.",
      href: "/estimation",
    },
    {
      n: "03",
      fr: "Louer",
      en: "Rent",
      dfr: "Location longue durée, saisonnière et biens premium.",
      den: "Long-term, seasonal rentals and premium homes.",
      href: "/biens?transaction=rent",
    },
    {
      n: "04",
      fr: "Investir",
      en: "Invest",
      dfr: "Identification des opportunités et conseil immobilier à Marrakech.",
      den: "Opportunity sourcing and real-estate advisory in Marrakech.",
      href: "/contact",
    },
  ];

  const stats = [
    { value: `${settings.yearsExperience}+`, fr: "Années d'expérience", en: "Years of experience" },
    { value: `${settings.propertiesSold}+`, fr: "Transactions", en: "Transactions" },
    { value: `${settings.activeProperties}+`, fr: "Biens actifs", en: "Active listings" },
    { value: `${settings.clientCount}+`, fr: "Quartiers couverts", en: "Neighborhoods covered" },
  ];

  return (
    <>
      {/* 01 HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Villa contemporaine à Marrakech"
            fill
            priority
            sizes="100vw"
            className="hero-zoom object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/25 to-charcoal/75" />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-center px-5 pb-[320px] pt-32 md:px-10 md:pb-[280px]">
          <p className="label-xs fade-up text-white/75">
            {en ? "Exceptional real estate • Marrakech" : "Immobilier d'exception • Marrakech"}
          </p>
          <h1
            className="display fade-up mt-7 max-w-5xl text-[42px] text-white sm:text-[62px] lg:text-[84px]"
            style={{ animationDelay: "120ms" }}
          >
            {en ? (
              <>
                Find more than a property.
                <br />
                Find your place in Marrakech.
              </>
            ) : (
              <>
                Trouvez plus qu&apos;une propriété.
                <br />
                Trouvez votre place à Marrakech.
              </>
            )}
          </h1>
          <p
            className="fade-up mt-8 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-[16px]"
            style={{ animationDelay: "240ms" }}
          >
            {en
              ? "Villas, apartments, riads and exceptional properties curated in the most beautiful neighborhoods of Marrakech."
              : "Villas, appartements, riads et propriétés d'exception sélectionnés dans les plus beaux quartiers de Marrakech."}
          </p>
          <div className="fade-up mt-10 flex flex-wrap gap-4" style={{ animationDelay: "340ms" }}>
            <Link
              href="/biens"
              className="label-xs bg-white px-8 py-4 text-charcoal transition-colors hover:bg-champagne hover:text-white"
            >
              {en ? "Explore properties" : "Explorer les biens"}
            </Link>
            <Link
              href="/estimation"
              className="label-xs border border-white/60 px-8 py-4 text-white transition-colors hover:bg-white hover:text-charcoal"
            >
              {en ? "List my property" : "Confier mon bien"}
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-[22%] px-4 md:px-0">
          <div className="mx-auto w-full max-w-[1400px] md:w-[86vw]">
            <SearchPanel lang={lang} neighborhoods={hoods.map((n) => ({ name: n.name, slug: n.slug }))} />
          </div>
        </div>
      </section>

      {/* 02 QUICK TYPES */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 pt-[240px] md:px-10 md:pt-[220px]">
        <div className="grid grid-cols-2 gap-px bg-sand md:grid-cols-3 lg:grid-cols-6">
          {PROPERTY_TYPES.slice(0, 6).map((t, i) => (
            <Reveal key={t.value} delay={i * 60}>
              <Link
                href={`/types/${t.value}`}
                className="group flex h-full flex-col justify-between bg-warm p-6 transition-colors hover:bg-white"
              >
                <span className="label-xs text-champagne">{String(i + 1).padStart(2, "0")}</span>
                <div className="mt-10">
                  <p className="text-[16px] font-semibold tracking-[-0.01em] group-hover:text-champagne">
                    {propertyTypePlural(t.value, lang)}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">
                    {counts[t.value] ?? 0} {en ? "listings" : "biens"}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 03 FEATURED */}
      {featured.length > 0 && (
        <section className="pb-28">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <Reveal>
              <p className="label-xs text-champagne">{en ? "Agency selection" : "Sélection de l'agence"}</p>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                <h2 className="display max-w-2xl text-[34px] sm:text-[46px] lg:text-[58px]">
                  {en ? (
                    <>
                      Properties that deserve
                      <br />
                      your attention.
                    </>
                  ) : (
                    <>
                      Des biens qui méritent
                      <br />
                      votre attention.
                    </>
                  )}
                </h2>
                <Link href="/biens" className="label-xs border-b border-charcoal pb-2 hover:text-champagne">
                  {en ? "View all" : "Voir tous les biens"}
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="mt-14 -mx-0">
            <FeaturedCarousel items={featured.map(toCard)} lang={lang} />
          </div>
        </section>
      )}

      {/* 04 IMMERSIVE MARRAKECH */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        <Image src={MARRAKECH_IMAGE} alt="Marrakech" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 md:px-10">
          <Reveal>
            <p className="label-xs text-white/70">Marrakech</p>
            <h2 className="display mt-5 text-[44px] text-white sm:text-[68px] lg:text-[92px]">
              {en ? "An art of living" : "Un art de vivre"}
            </h2>
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/75">
              {en
                ? "Between contemporary architecture, historic riads, golf courses and Atlas landscapes, discover another way to live Marrakech."
                : "Entre architecture contemporaine, riads historiques, golfs et paysages de l'Atlas, découvrez une autre manière de vivre Marrakech."}
            </p>
            <Link
              href="/quartiers"
              className="label-xs mt-10 inline-block border border-white/60 px-8 py-4 text-white transition-colors hover:bg-white hover:text-charcoal"
            >
              {en ? "Discover Marrakech" : "Découvrir Marrakech"}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 05 LATEST */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label-xs text-champagne">{en ? "New listings" : "Nouveautés"}</p>
              <h2 className="display mt-5 text-[34px] sm:text-[46px]">
                {en ? "Latest properties" : "Dernières propriétés"}
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] text-muted">
                {en
                  ? "The latest opportunities added by our team."
                  : "Les dernières opportunités ajoutées par notre équipe."}
              </p>
            </div>
            <Link
              href="/biens"
              className="label-xs bg-charcoal px-8 py-4 text-white transition-colors hover:bg-champagne"
            >
              {en ? "View all properties" : "Voir tous les biens"}
            </Link>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <PropertyCard property={toCard(p)} lang={lang} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 06 MAP */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <p className="label-xs text-champagne">{en ? "Interactive map" : "Carte interactive"}</p>
            <h2 className="display mt-5 text-[34px] sm:text-[46px]">{en ? "Explore Marrakech" : "Explorez Marrakech"}</h2>
          </Reveal>
          <div className="mt-12">
            <HomeMapSection points={mapProps.map((p) => toPoint(p, lang))} lang={lang} />
          </div>
        </div>
      </section>

      {/* 07 NEIGHBORHOODS */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10">
        <Reveal>
          <p className="label-xs text-champagne">{en ? "Neighborhoods" : "Quartiers"}</p>
          <h2 className="display mt-5 max-w-2xl text-[34px] sm:text-[46px] lg:text-[56px]">
            {en ? (
              <>
                The most sought-after
                <br />
                addresses in Marrakech
              </>
            ) : (
              <>
                Les adresses les plus
                <br />
                recherchées de Marrakech
              </>
            )}
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {hoods[0] && <NeighborhoodCard hood={hoods[0]} lang={lang} big />}
          <div className="grid gap-6 sm:grid-cols-2">
            {hoods.slice(1, 5).map((h) => (
              <NeighborhoodCard key={h.id} hood={h} lang={lang} />
            ))}
          </div>
        </div>
        <div className="mt-10">
          <Link href="/quartiers" className="label-xs border-b border-charcoal pb-2 hover:text-champagne">
            {en ? "All neighborhoods" : "Tous les quartiers"}
          </Link>
        </div>
      </section>

      {/* 08 SERVICES */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <p className="label-xs text-champagne">{en ? "Services" : "Services"}</p>
            <h2 className="display mt-5 text-[34px] sm:text-[46px]">
              {en ? "How we work with you." : "Notre accompagnement."}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px bg-sand md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <Link href={s.href} className="group flex h-full flex-col bg-white p-8 transition-colors hover:bg-warm">
                  <span className="font-display text-[40px] text-sand transition-colors group-hover:text-champagne">
                    {s.n}
                  </span>
                  <h3 className="mt-8 text-[19px] font-semibold uppercase tracking-[0.06em]">{en ? s.en : s.fr}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-muted">{en ? s.den : s.dfr}</p>
                  <span className="label-xs mt-10 inline-flex items-center gap-2 text-champagne">
                    {en ? "Learn more" : "En savoir plus"}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 09 STATS */}
      <section className="bg-charcoal text-white">
        <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-2">
          <div className="relative min-h-[420px] lg:min-h-[640px]">
            <Image src={STATS_IMAGE} alt="Marrakech architecture" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center px-5 py-20 md:px-16">
            <Reveal>
              <p className="label-xs text-champagne">{en ? "Our expertise" : "Notre expertise"}</p>
              <h2 className="display mt-6 text-[34px] sm:text-[48px]">
                {en ? (
                  <>
                    The local market.
                    <br />
                    An international vision.
                  </>
                ) : (
                  <>
                    Le marché local.
                    <br />
                    Une vision internationale.
                  </>
                )}
              </h2>
            </Reveal>
            <div className="mt-14 grid grid-cols-2 gap-10">
              {stats.map((s, i) => (
                <Reveal key={s.en} delay={i * 70}>
                  <p className="font-display text-[46px] leading-none text-champagne">{s.value}</p>
                  <p className="label-xs mt-3 text-white/60">{en ? s.en : s.fr}</p>
                </Reveal>
              ))}
            </div>
            <Link
              href="/agence"
              className="label-xs mt-14 inline-block w-fit border border-white/50 px-8 py-4 transition-colors hover:bg-white hover:text-charcoal"
            >
              {en ? "Our agency" : "Notre agence"}
            </Link>
          </div>
        </div>
      </section>

      {/* 10 COLLECTIONS */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10">
        <Reveal>
          <p className="label-xs text-champagne">Collections</p>
          <h2 className="display mt-5 max-w-xl text-[34px] sm:text-[46px]">
            {en ? (
              <>
                Find the property
                <br />
                that suits you.
              </>
            ) : (
              <>
                Trouvez le bien
                <br />
                qui vous ressemble.
              </>
            )}
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROPERTY_TYPES.map((t, i) => (
            <Reveal key={t.value} delay={(i % 3) * 80}>
              <Link href={`/types/${t.value}`} className="group relative block h-[300px] overflow-hidden">
                <Image
                  src={COLLECTION_IMAGES[t.value]}
                  alt={t.fr}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-charcoal/35 transition-colors group-hover:bg-charcoal/50" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7 text-white">
                  <div>
                    <p className="font-display text-[30px] leading-none">{propertyTypePlural(t.value, lang)}</p>
                    <p className="label-xs mt-3 text-white/70">
                      {counts[t.value] ?? 0} {en ? "listings" : "biens"}
                    </p>
                  </div>
                  <span className="text-[22px] transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 11 AGENTS */}
      {agentList.length > 0 && (
        <section className="bg-white py-28">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <Reveal>
              <p className="label-xs text-champagne">{en ? "Our team" : "Notre équipe"}</p>
              <h2 className="display mt-5 max-w-xl text-[34px] sm:text-[46px]">
                {en ? (
                  <>
                    Experts who truly know
                    <br />
                    Marrakech.
                  </>
                ) : (
                  <>
                    Des experts qui connaissent
                    <br />
                    Marrakech.
                  </>
                )}
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {agentList.slice(0, 3).map((a, i) => (
                <Reveal key={a.id} delay={i * 80}>
                  <Link href={`/agents/${a.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                      {a.photoUrl && (
                        <Image
                          src={a.photoUrl}
                          alt={a.name}
                          fill
                          sizes="33vw"
                          className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                        />
                      )}
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="flex w-full flex-wrap gap-4 p-6 text-white">
                          {a.phone && <span className="label-xs">{a.phone}</span>}
                          <span className="label-xs text-champagne">WhatsApp</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-5 text-[18px] font-medium">{a.name}</p>
                    <p className="mt-1 text-[13px] text-muted">{a.jobTitle}</p>
                    {a.languages && <p className="label-xs mt-3 text-champagne">{a.languages}</p>}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12 TESTIMONIALS */}
      {quotes.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10">
          <Reveal>
            <p className="label-xs mb-12 text-champagne">{en ? "Client stories" : "Ils nous ont fait confiance"}</p>
            <Testimonials items={quotes} lang={lang} />
          </Reveal>
        </section>
      )}

      {/* 13 INSIGHTS */}
      {articleList.length > 0 && (
        <section className="bg-white py-28">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="label-xs text-champagne">{en ? "Market insights" : "Le journal"}</p>
                  <h2 className="display mt-5 text-[34px] sm:text-[46px]">
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
                  </h2>
                </div>
                <Link href="/blog" className="label-xs border-b border-charcoal pb-2 hover:text-champagne">
                  {en ? "All articles" : "Tous les articles"}
                </Link>
              </div>
            </Reveal>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {articleList.map((a, i) => (
                <Reveal key={a.id} delay={i * 80}>
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
                    <p className="label-xs mt-6 text-champagne">{a.category}</p>
                    <h3 className="mt-3 font-display text-[26px] leading-tight group-hover:text-champagne">
                      {pick(lang, a.titleFr, a.titleEn)}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-[14px] text-muted">{pick(lang, a.excerptFr, a.excerptEn)}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 14 VALUATION CTA */}
      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[380px] lg:min-h-[600px]">
          <Image src={VALUATION_IMAGE} alt="Villa Marrakech" fill sizes="50vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-stone px-5 py-20 md:px-16">
          <Reveal>
            <p className="label-xs text-champagne">{en ? "Sell with us" : "Vendre avec nous"}</p>
            <h2 className="display mt-6 text-[34px] sm:text-[52px]">
              {en ? (
                <>
                  Thinking about
                  <br />
                  selling your property?
                </>
              ) : (
                <>
                  Vous souhaitez
                  <br />
                  vendre votre bien ?
                </>
              )}
            </h2>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-muted">
              {en
                ? "Receive a personalised valuation from a specialist of the Marrakech property market."
                : "Recevez une estimation personnalisée réalisée par un spécialiste du marché immobilier marrakchi."}
            </p>
            <Link
              href="/estimation"
              className="label-xs mt-10 inline-block bg-charcoal px-9 py-4 text-white transition-colors hover:bg-champagne"
            >
              {en ? "Request a valuation" : "Demander une estimation"}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function NeighborhoodCard({
  hood,
  lang,
  big = false,
}: {
  hood: { name: string; slug: string; coverImage: string | null; descriptorFr: string | null; descriptorEn: string | null; propertyCount: number };
  lang: "fr" | "en";
  big?: boolean;
}) {
  return (
    <Reveal className="h-full">
      <Link
        href={`/quartiers/${hood.slug}`}
        className={`group relative block w-full overflow-hidden ${big ? "h-[400px] lg:h-[640px]" : "h-[300px]"}`}
      >
        {hood.coverImage && (
          <Image
            src={hood.coverImage}
            alt={hood.name}
            fill
            sizes={big ? "50vw" : "25vw"}
            className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-transparent transition-opacity group-hover:from-charcoal/90" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 text-white">
          <div>
            <p className={`font-display leading-none ${big ? "text-[40px]" : "text-[28px]"}`}>{hood.name}</p>
            <p className="mt-3 max-w-xs text-[13px] text-white/70">
              {lang === "en" ? hood.descriptorEn ?? hood.descriptorFr : hood.descriptorFr}
            </p>
            <p className="label-xs mt-3 text-champagne">
              {hood.propertyCount} {lang === "en" ? "listings" : "biens"}
            </p>
          </div>
          <span className="text-[22px] transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>
    </Reveal>
  );
}
