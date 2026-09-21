import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PropertyCard from "@/components/PropertyCard";
import SearchPanel from "@/components/site/SearchPanel";
import FeaturedCarousel from "@/components/site/FeaturedCarousel";
import HomeMapSection from "@/components/site/HomeMapSection";
import Testimonials from "@/components/site/Testimonials";
import NewsletterForm from "@/components/site/NewsletterForm";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { PROPERTY_TYPES, propertyTypePlural } from "@/lib/site";
import {
  DEFAULT_AGENCY_SETTINGS,
  getSettings,
  listAgents,
  listArticles,
  listNeighborhoods,
  listProperties,
  listTestimonials,
  typeCounts,
} from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";
import { toCard, toPoint } from "@/lib/mappers";

const MARRAKECH_IMAGE =
  "https://images.pexels.com/photos/38891222/pexels-photo-38891222.jpeg?auto=compress&cs=tinysrgb&w=2000";
const STATS_IMAGE =
  "https://images.pexels.com/photos/15260622/pexels-photo-15260622.jpeg?auto=compress&cs=tinysrgb&w=1600";
const VALUATION_IMAGE =
  "https://images.pexels.com/photos/8134745/pexels-photo-8134745.jpeg?auto=compress&cs=tinysrgb&w=1600";
const QUICK_TYPE_ICONS: Record<string, string> = {
  villa: "/icons/Villas.png",
  appartement: "/icons/Appartements.png",
  riad: "/icons/Riads.png",
  maison: "/icons/Maisons.png",
  terrain: "/icons/Terrains.png",
  bureau: "/icons/Bureaux.png",
};

const COLLECTION_IMAGES: Record<string, string> = {
  villa: "https://images.pexels.com/photos/9730025/pexels-photo-9730025.jpeg?auto=compress&cs=tinysrgb&w=1200",
  appartement: "https://images.pexels.com/photos/7005300/pexels-photo-7005300.jpeg?auto=compress&cs=tinysrgb&w=1200",
  riad: "https://images.pexels.com/photos/10573397/pexels-photo-10573397.jpeg?auto=compress&cs=tinysrgb&w=1200",
  maison: "https://images.pexels.com/photos/6283965/pexels-photo-6283965.jpeg?auto=compress&cs=tinysrgb&w=1200",
  terrain: "https://images.pexels.com/photos/38787221/pexels-photo-38787221.jpeg?auto=compress&cs=tinysrgb&w=1200",
  bureau: "https://images.pexels.com/photos/8606292/pexels-photo-8606292.jpeg?auto=compress&cs=tinysrgb&w=1200",
  commerce: "https://images.pexels.com/photos/2610815/pexels-photo-2610815.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const lang = await getLang();
  const en = lang === "en";
  const [settings, hoods, featured, latest, mapProps, agentList, articleList, quotes, counts] = await Promise.all([
    loadPublicData(() => getSettings(), DEFAULT_AGENCY_SETTINGS),
    loadPublicData(() => listNeighborhoods(), []),
    loadPublicData(() => listProperties({ featured: true, limit: 9 }), []),
    loadPublicData(() => listProperties({ limit: 6 }), []),
    loadPublicData(() => listProperties({ limit: 60 }), []),
    loadPublicData(() => listAgents(), []),
    loadPublicData(() => listArticles(true, 3), []),
    loadPublicData(() => listTestimonials(), []),
    loadPublicData(() => typeCounts(), {}),
  ]);

  const services = [
    {
      n: "01",
      fr: "Acheter",
      en: "Buy",
      dfr: "Une sélection pensée pour vous. Nous identifions les biens qui correspondent à votre projet et vous accompagnons jusqu'à la signature.",
      den: "A personalised selection and full guidance all the way to signature.",
      href: "/biens?transaction=sale",
    },
    {
      n: "02",
      fr: "Vendre",
      en: "Sell",
      dfr: "Vendez au juste prix. Estimation précise, mise en valeur et diffusion ciblée pour vendre votre bien dans les meilleures conditions.",
      den: "Valuation, staging and marketing of your property.",
      href: "/confiez-nous-votre-bien",
    },
    {
      n: "03",
      fr: "Louer",
      en: "Rent",
      dfr: "Louez en toute confiance. Location longue durée, saisonnière ou premium : nous trouvons le bon profil pour votre bien.",
      den: "Long-term, seasonal rentals and premium homes.",
      href: "/biens?transaction=rent",
    },
    {
      n: "04",
      fr: "Home Staging",
      en: "Home Staging",
      dfr: "Mettez votre bien en valeur. Désencombrement, aménagement et décoration pour révéler tout le potentiel de votre intérieur.",
      den: "Decluttering, layout and styling to reveal your property's potential.",
      href: "/home-staging",
    },
    {
      n: "05",
      fr: "Investir",
      en: "Invest",
      dfr: "Investissez avec discernement. Nous identifions les opportunités du marché marrakchi et vous conseillons sur chaque projet.",
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
      <section className="relative w-full overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            aria-label="Villa contemporaine à Marrakech"
          >
            <source src="/hero%20section.mp4" type="video/mp4" />
          </video>
          <div className="hero-color-overlay absolute inset-0" />
        </div>

        <div className="relative mx-auto flex min-h-[max(650px,75svh)] max-w-[1600px] flex-col items-center justify-center px-5 pb-24 pt-32 text-center md:min-h-[80svh] md:px-10 md:pt-40">
          <p className="label-xs fade-up text-white/75">
            {en ? "Exceptional real estate • Marrakech" : "Immobilier d'exception • Marrakech"}
          </p>
          <h1
            className="fade-up mt-5 max-w-5xl font-sans text-[36px] font-bold leading-[1.06] tracking-[-0.045em] text-white sm:text-[48px] lg:text-[60px]"
            style={{ animationDelay: "120ms" }}
          >
            {en ? (
              <>
                Your Property Awaits You Here.
                <br className="hidden sm:block" />
                in Marrakech.
              </>
            ) : (
              <>
                Votre bien vous attend ici.
                <br className="hidden sm:block" />
                à Marrakech.
              </>
            )}
          </h1>
          <p
            className="fade-up mt-5 max-w-2xl text-[14px] leading-relaxed text-white/80 md:text-[16px]"
            style={{ animationDelay: "240ms" }}
          >
            {en
              ? "Villas, riads, apartments, and plots selected in Marrakech’s most sought-after neighborhoods. Every property is carefully verified and presented by our team."
              : "Villas, riads, appartements et terrains sélectionnés dans les quartiers les plus recherchés de Marrakech. Chaque bien est vérifié et présenté par notre équipe."}
          </p>
          <div className="fade-up mt-10 w-full max-w-[1380px]" style={{ animationDelay: "340ms" }}>
            <SearchPanel lang={lang} neighborhoods={hoods.map((n) => ({ name: n.name, slug: n.slug }))} />
          </div>
        </div>
      </section>

      {/* 02 QUICK TYPES */}
      <section className="relative z-10 mx-auto -mt-6 max-w-[1600px] px-0 pb-24 pt-0 md:-mt-10 md:px-10 md:pb-28">
        <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[20px] bg-transparent md:grid md:grid-cols-3 lg:grid-cols-6">
          {PROPERTY_TYPES.slice(0, 6).map((t, i) => (
            <Reveal key={t.value} delay={i * 60} className="min-w-[155px] snap-start md:min-w-0">
              <Link
                href={`/types/${t.value}`}
                className="group relative m-1 flex h-[calc(100%-0.5rem)] min-h-[168px] flex-col items-center justify-center rounded-[20px] bg-white px-5 py-7 text-center transition-colors duration-300 hover:bg-warm"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-champagne transition-transform duration-300 group-hover:scale-x-100" />
                <Image src={QUICK_TYPE_ICONS[t.value]} alt="" width={42} height={42} className="h-[84px] w-[84px] object-contain transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span className="label-xs mt-3 text-muted">{String(i + 1).padStart(2, "0")}</span>
                <div className="mt-2">
                  <p className="text-[16px] font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-champagne">
                    {propertyTypePlural(t.value, lang)}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">
                    {counts[t.value] ?? 0} {en ? ((counts[t.value] ?? 0) === 1 ? "listing" : "listings") : (counts[t.value] ?? 0) === 1 ? "bien" : "biens"}
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
              <p className="label-xs text-accent">{en ? "Agency selection" : "Sélection de l'agence"}</p>
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
                <Link href="/biens" className="label-xs border-b border-charcoal pb-2 hover:text-accent">
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

      {/* 05 LATEST */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label-xs text-accent">{en ? "New listings" : "Nouveautés"}</p>
              <h2 className="display mt-5 text-[34px] sm:text-[46px]">
                {en ? "Our Latest Properties" : "Nos Dernières propriétés"}
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] text-secondary">
                {en
                  ? "The latest opportunities added by our team."
                  : "Les dernières opportunités ajoutées par notre équipe."}
              </p>
            </div>
            <Link
              href="/biens"
              className="label-xs bg-charcoal px-8 py-4 text-white transition-colors hover:bg-ink"
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


      {/* 04 IMMERSIVE MARRAKECH */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        <Image src={MARRAKECH_IMAGE} alt="Marrakech" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 md:px-10">
          <Reveal>
            <p className="label-xs text-white/70">Marrakech</p>
            <h2 className="display mt-5 text-[44px] text-white sm:text-[68px] lg:text-[92px]">
              {en ? "Marrakech, an Art of Living." : "Marrakech, un art de vivre."}
            </h2>
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/75">
              {en
                ? "Contemporary architecture, historic riads, and Atlas Mountain landscapes: discover a different way of living in the city."
                : "Architecture contemporaine, riads historiques et paysages de l'Atlas : découvrez une autre façon d'habiter la ville."}
            </p>
            <Link
              href="/quartiers"
              className="label-xs mt-10 inline-block border border-white/60 px-8 py-4 text-white transition-colors hover:bg-surface hover:text-charcoal"
            >
              {en ? "Discover the Neighborhoods →" : "Découvrir les quartiers →"}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 06 MAP */}
      <section className="bg-stone py-28">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <p className="label-xs text-accent">{en ? "Interactive map" : "Carte interactive"}</p>
            <h2 className="display mt-5 text-[34px] sm:text-[46px]">{en ? "Explore Marrakech" : "Explorez Marrakech"}</h2>
          </Reveal>
          <div className="mt-12">
            <HomeMapSection points={mapProps.map((p) => toPoint(p, lang))} lang={lang} />
          </div>
        </div>
      </section>

      {/* HOME STAGING */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.pexels.com/photos/7005300/pexels-photo-7005300.jpeg?auto=compress&cs=tinysrgb&w=2400"
              alt={en ? "A bright, welcoming interior" : "Un intérieur lumineux et accueillant"}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/55" />
          </div>
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 md:px-10">
          <Reveal>
            <p className="label-xs text-white/70">Home Staging</p>
            <h2 className="display mt-5 text-[44px] text-white sm:text-[68px] lg:text-[92px]">
              {en ? "Reveal your property's potential." : "Révélez le potentiel de votre bien."}
            </h2>
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/75">
              {en
                ? "Decluttering, rearranging, and decorating: we prepare your property to help every visitor envision themselves in the space."
                : "Désencombrement, réorganisation et décoration : nous préparons votre bien pour aider chaque visiteur à s'y projeter."}
            </p>
            <Link
              href="/home-staging"
              className="label-xs mt-10 inline-block border border-white/60 px-8 py-4 text-white transition-colors hover:bg-surface hover:text-charcoal"
            >
              {en ? "Discover Home Staging" : "Découvrir le Home Staging"}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 07 NEIGHBORHOODS */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10">
        <Reveal>
          <p className="label-xs text-accent">{en ? "Neighborhoods" : "Quartiers"}</p>
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
          <Link href="/quartiers" className="label-xs border-b border-charcoal pb-2 hover:text-accent">
            {en ? "All neighborhoods" : "Tous les quartiers"}
          </Link>
        </div>
      </section>

      {/* 08 SERVICES */}
      <section className="bg-page py-28">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <p className="label-xs text-accent">{en ? "Services" : "Services"}</p>
            <h2 className="display mt-5 text-[34px] sm:text-[46px]">
              {en ? "How we work with you." : "Notre accompagnement."}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px border-b border-charcoal/15 bg-charcoal/15 md:grid-cols-2 lg:grid-cols-5">
            {services.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <Link href={s.href} className="service-color-card group flex h-full flex-col border border-charcoal/20 bg-page p-8 transition-colors duration-300 hover:bg-sand focus-visible:bg-sand">
                  <span className="font-display text-[40px] text-sand transition-colors duration-300 group-hover:text-charcoal group-focus-visible:text-charcoal">
                    {s.n}
                  </span>
                  <h3 className="mt-8 text-[19px] font-semibold uppercase tracking-[0.06em]">{en ? s.en : s.fr}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-secondary">{en ? s.den : s.dfr}</p>
                  <span className="label-xs mt-10 inline-flex items-center gap-2 text-accent">
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
              <p className="label-xs text-accent">{en ? "Our expertise" : "Notre expertise"}</p>
              <h2 className="display mt-6 text-[34px] sm:text-[48px]">
                {en
                  ? "Local Market Expertise, International Perspective."
                  : "Le marché local, un regard international."}
              </h2>
              <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/75">
                {en
                  ? "Twelve years of on-the-ground experience, serving a discerning Moroccan and international clientele."
                  : "Douze ans d'expérience du terrain, au service d'une clientèle marocaine et internationale exigeante."}
              </p>
            </Reveal>
            <div className="mt-14 grid grid-cols-2 gap-10">
              {stats.map((s, i) => (
                <Reveal key={s.en} delay={i * 70}>
                  <p className="font-display text-[46px] leading-none text-accent">{s.value}</p>
                  <p className="label-xs mt-3 text-white/60">{en ? s.en : s.fr}</p>
                </Reveal>
              ))}
            </div>
            <Link
              href="/agence"
              className="label-xs mt-14 inline-block w-fit border border-white/50 px-8 py-4 transition-colors hover:bg-surface hover:text-charcoal"
            >
              {en ? "Our agency" : "Notre agence"}
            </Link>
          </div>
        </div>
      </section>

      {/* 10 COLLECTIONS */}
      <section className="bg-stone py-28">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <p className="label-xs text-accent">Collections</p>
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
        </div>
      </section>

      {/* 11 AGENTS */}
      {agentList.length > 0 && (
        <section className="bg-page py-28">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <Reveal>
              <p className="label-xs text-accent">{en ? "Our team" : "Notre équipe"}</p>
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
                          <span className="label-xs text-accent">WhatsApp</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-5 text-[18px] font-medium">{a.name}</p>
                    <p className="mt-1 text-[13px] text-secondary">{a.jobTitle}</p>
                    {a.languages && <p className="label-xs mt-3 text-accent">{a.languages}</p>}
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
            <p className="label-xs mb-12 text-accent">{en ? "Client stories" : "Ils nous ont fait confiance"}</p>
            <Testimonials items={quotes} lang={lang} />
          </Reveal>
        </section>
      )}

      {/* 13 INSIGHTS */}
      {articleList.length > 0 && (
        <section className="bg-stone py-28">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="label-xs text-accent">{en ? "Market insights" : "Le journal"}</p>
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
                <Link href="/blog" className="label-xs border-b border-charcoal pb-2 hover:text-accent">
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
                    <p className="label-xs mt-6 text-accent">{a.category}</p>
                    <h3 className="mt-3 font-display text-[26px] leading-tight group-hover:text-accent">
                      {pick(lang, a.titleFr, a.titleEn)}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-[14px] text-secondary">{pick(lang, a.excerptFr, a.excerptEn)}</p>
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
            <p className="label-xs text-accent">{en ? "Sell with us" : "Vendre avec nous"}</p>
            <h2 className="display mt-6 text-[34px] sm:text-[52px]">
              {en ? (
                <>
                  Thinking about
                  <br />
                  selling your property?
                </>
              ) : (
                "Une estimation, sans engagement."
              )}
            </h2>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-secondary">
              {en
                ? "Receive a personalised valuation from a specialist of the Marrakech property market."
                : "Recevez une évaluation précise de votre bien, réalisée par un spécialiste du marché marrakchi."}
            </p>
            <Link
              href="/estimation"
              className="label-xs mt-10 inline-block bg-charcoal px-9 py-4 text-white transition-colors hover:bg-ink"
            >
              {en ? "Request a valuation" : "Demander une estimation →"}
            </Link>
          </Reveal>
        </div>
      </section>
      {/* 15 NEWSLETTER */}
      <section className="bg-page px-5 py-24 md:px-10 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="label-xs text-accent">Newsletter</p>
          <h2 className="display mt-5 text-[34px] sm:text-[46px]">
            {en ? "The latest listings, before everyone else." : "Les nouveautés, avant tout le monde."}
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-secondary">
            {en
              ? "Receive newly added properties directly in your inbox."
              : "Recevez les biens récemment ajoutés directement dans votre boîte mail."}
          </p>
          <div className="mx-auto mt-10 max-w-2xl text-left">
            <NewsletterForm lang={lang} />
          </div>
        </Reveal>
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
            <p className="label-xs mt-3 text-accent">
              {hood.propertyCount} {lang === "en" ? "listings" : "biens"}
            </p>
          </div>
          <span className="text-[22px] transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>
    </Reveal>
  );
}
