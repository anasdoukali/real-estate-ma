import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { DEFAULT_AGENCY_SETTINGS, getSettings, listAgents } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notre agence immobilière à Marrakech",
  description: "Une agence marrakchie dédiée aux biens d'exception : villas, riads, appartements et domaines.",
};

const HERO = "/images/agency/branding-feedback.png";
const SIDE = "/images/agency/carree-eden.png";
const DOCUMENTS = "/images/agency/apartment-sale.jpg";

export default async function AgencyPage() {
  const lang = await getLang();
  const en = lang === "en";
  const [settings, team] = await Promise.all([
    loadPublicData(() => getSettings(), DEFAULT_AGENCY_SETTINGS),
    loadPublicData(() => listAgents(), []),
  ]);

  const values = [
    {
      fr: "Sélection exigeante",
      en: "Rigorous curation",
      dfr: "Chaque bien est visité, vérifié et présenté avec une photographie soignée.",
      den: "Every property is visited, verified and presented with careful photography.",
    },
    {
      fr: "Discrétion",
      en: "Discretion",
      dfr: "Une partie de nos biens est proposée en off-market, réservée à nos clients.",
      den: "Some of our properties are offered off-market, exclusively to our clients.",
    },
    {
      fr: "Accompagnement complet",
      en: "End-to-end support",
      dfr: "Notaire, financement, travaux, gestion locative : nous coordonnons chaque étape pour vous.",
      den: "Notary services, financing, renovations, property management: we coordinate every step for you.",
    },
  ];

  return (
    <>
      <section className="relative h-[72vh] min-h-[440px] overflow-hidden">
        <Image src={HERO} alt="Marrakech" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10">
          <p className="label-xs text-white/70">{en ? "The agency" : "L'agence"}</p>
          <h1 className="display mt-4 max-w-4xl text-[40px] text-white sm:text-[68px]">
            {en ? "Marrakech, seen by those who live here." : "Marrakech, lue par ceux qui y vivent."}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[60%_40%]">
          <Reveal>
            <p className="label-xs text-accent">{en ? "Our mission" : "Notre mission"}</p>
            <p className="display mt-8 text-[28px] sm:text-[36px]">
              {en
                ? "Connecting exceptional properties with the people who will truly live in them."
                : "Relier des propriétés d'exception aux personnes qui sauront réellement les habiter."}
            </p>
            <p className="mt-8 max-w-2xl text-[16px] leading-[1.9] text-ink/80">
              {en
                ? `${settings.agencyName} was created to offer a more exacting and personal way of working in Marrakech real estate.`
                : `${settings.agencyName} est née pour proposer une façon plus exigeante et plus personnelle de travailler l'immobilier à Marrakech.`}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative ml-auto aspect-[16/10] w-full max-w-[560px] overflow-hidden">
              <Image src={SIDE} alt="Louka & Vendy à Marrakech" fill sizes="45vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-stone py-24">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-10 lg:grid-cols-[42%_58%] lg:items-end">
          <Reveal>
            <p className="label-xs text-accent">{en ? "Why we exist" : "Pourquoi Louka & Vendy existe"}</p>
            <h2 className="display mt-5 text-[34px] sm:text-[48px]">{en ? "A profession too often done poorly." : "Un métier trop souvent mal fait."}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-3xl text-[17px] leading-[1.9] text-ink/80">
              {en
                ? "A poorly valued property sells too high, for too long, or too quickly and badly. A poorly presented property never finds the right buyer. And a client left alone in the process loses time — and sometimes an opportunity. Louka & Vendy Real Estate was created to fill those gaps: accurate valuation, careful presentation and real support through to the end."
                : "Un bien mal estimé se vend trop cher, trop longtemps, ou trop vite et mal. Un bien mal présenté ne trouve jamais le bon acquéreur, même quand il le mérite. Un client livré à lui-même dans les démarches perd du temps et parfois une opportunité. Louka & Vendy Real Estate est née pour combler ces manques : estimation juste, présentation soignée, accompagnement réel jusqu'au bout."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-charcoal py-24 text-white">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-12 px-5 md:px-10 lg:grid-cols-4">
          {[
            { v: `${settings.yearsExperience}+`, l: en ? "Years of experience" : "Années d'expérience" },
            { v: `${settings.propertiesSold}+`, l: en ? "Properties sold" : "Biens vendus" },
            { v: `${settings.activeProperties}+`, l: en ? "Active listings" : "Biens actifs" },
            { v: `${settings.clientCount}+`, l: en ? "Neighborhoods" : "Quartiers couverts" },
          ].map((s) => (
            <Reveal key={s.l}>
              <p className="font-display text-[46px] leading-none text-accent">{s.v}</p>
              <p className="label-xs mt-4 text-white/60">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <p className="label-xs text-accent">{en ? "Our values" : "Nos valeurs"}</p>
        <h2 className="display mt-5 max-w-2xl text-[34px] sm:text-[46px]">{en ? "What we believe in." : "Ce en quoi nous croyons."}</h2>
        <div className="mt-10 grid gap-px border border-sand bg-sand md:grid-cols-3">
          {values.map((v) => (
            <Reveal key={v.en}>
              <div className="h-full bg-page p-9">
                <h3 className="font-display text-[26px]">{en ? v.en : v.fr}</h3>
                <p className="mt-4 text-[14.5px] leading-relaxed text-secondary">{en ? v.den : v.dfr}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="label-xs text-accent">{en ? "The same service for everyone" : "Le même service pour tous"}</p>
            <h2 className="display mt-5 text-[30px] sm:text-[40px]">{en ? "Selling, buying, renting: no preference." : "Vendre, acheter, louer : aucune préférence."}</h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-[1.9] text-ink/80">{en ? "At Louka & Vendy, a client renting receives the same attention as a client selling a multi-million property. Every call is handled, every message receives an answer — with no hierarchy based on the size of the project." : "Chez Louka & Vendy, un client qui loue reçoit la même attention qu'un client qui vend un bien de plusieurs millions. Chaque appel est traité, chaque message reçoit une réponse — sans hiérarchie selon la taille du projet. C'est une question de principe autant que de méthode."}</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="label-xs text-accent">{en ? "A relationship, not a transaction" : "Une relation, pas une transaction"}</p>
            <h2 className="display mt-5 text-[30px] sm:text-[40px]">{en ? "We do not do one-offs." : "Nous ne faisons pas de coups uniques."}</h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-[1.9] text-ink/80">{en ? "A purchase is never an endpoint; it is a step in a life path. Your home today may become your rental property tomorrow. We remain by your side after signing, anticipating the next step instead of moving on to the next client." : "Un achat n'est jamais un point final, c'est une étape dans une trajectoire de vie : votre résidence d'aujourd'hui peut devenir votre bien locatif de demain. Louka & Vendy reste à vos côtés bien après la signature, pour anticiper la prochaine étape plutôt que de passer au client suivant."}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-charcoal py-24 text-white">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-10 lg:grid-cols-[48%_52%] lg:items-center">
          <Reveal>
            <div className="relative aspect-[16/10] overflow-hidden"><Image src={DOCUMENTS} alt="Documents Louka & Vendy" fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" /></div>
          </Reveal>
          <Reveal delay={100}>
            <p className="label-xs text-champagne">{en ? "Full support" : "Un accompagnement de A à Z"}</p>
            <h2 className="display mt-5 text-[34px] sm:text-[48px]">{en ? "Private or professional, through to the end." : "Privé ou professionnel, jusqu'au bout."}</h2>
            <p className="mt-6 max-w-xl text-[16px] leading-[1.9] text-white/70">{en ? "Family home, pied-à-terre, offices or commercial premises: we support you from the first search to the handover of the keys, whatever the nature of your project." : "Logement familial, pied-à-terre, bureaux ou local commercial : nous vous accompagnons de la première recherche jusqu'à la remise des clés, quelle que soit la nature de votre projet."}</p>
          </Reveal>
        </div>
      </section>

      {team.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
          <p className="label-xs text-accent">{en ? "Our team" : "Notre équipe"}</p>
          <h2 className="display mt-5 text-[34px] sm:text-[46px]">
            {en ? "The people behind the agency." : "Les visages de l'agence."}
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((a) => (
              <Reveal key={a.id}>
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
                  </div>
                  <p className="mt-5 text-[18px] font-medium group-hover:text-accent">{a.name}</p>
                  <p className="mt-1 text-[13px] text-secondary">{a.jobTitle}</p>
                  <p className="mt-4 line-clamp-3 text-[13.5px] text-secondary">{pick(lang, a.bioFr, a.bioEn)}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-stone py-20">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-8 px-5 md:px-10">
          <h2 className="display max-w-xl text-[30px] sm:text-[42px]">
            {en ? "Let’s Talk About Your Project." : "Parlons de votre projet."}
          </h2>
          <Link href="/contact" className="label-xs bg-charcoal px-10 py-4 text-white hover:bg-ink">
            {en ? "Contact us →" : "Nous contacter →"}
          </Link>
        </div>
      </section>
    </>
  );
}
