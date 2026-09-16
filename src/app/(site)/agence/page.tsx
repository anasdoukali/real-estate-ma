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

const HERO = "https://images.pexels.com/photos/15360707/pexels-photo-15360707.jpeg?auto=compress&cs=tinysrgb&w=2000";
const SIDE = "https://images.pexels.com/photos/27945049/pexels-photo-27945049.jpeg?auto=compress&cs=tinysrgb&w=1400";

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
      dfr: "Une part importante de nos biens est proposée en off-market.",
      den: "A significant share of our portfolio is offered off-market.",
    },
    {
      fr: "Accompagnement complet",
      en: "End-to-end support",
      dfr: "Notaire, financement, travaux, gestion locative : nous coordonnons tout.",
      den: "Notary, financing, renovation, rental management: we coordinate everything.",
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
            {en ? "Marrakech, read by those who live it." : "Marrakech, lue par ceux qui y vivent."}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[55%_45%]">
          <Reveal>
            <p className="label-xs text-champagne">{en ? "Our mission" : "Notre mission"}</p>
            <p className="display mt-8 text-[28px] sm:text-[36px]">
              {en
                ? "Connecting exceptional properties with the people who will truly live in them."
                : "Relier des propriétés d'exception aux personnes qui sauront réellement les habiter."}
            </p>
            <p className="mt-8 max-w-2xl text-[16px] leading-[1.9] text-ink/80">
              {en
                ? `${settings.agencyName} is a Marrakech-based agency specialising in villas, riads, apartments and land in the city's most sought-after districts. Our approach combines a deep knowledge of local neighborhoods with the standards of international luxury real estate: precise valuations, editorial photography, confidentiality and rigorous follow-up.`
                : `${settings.agencyName} est une agence marrakchie spécialisée dans les villas, riads, appartements et terrains situés dans les quartiers les plus recherchés de la ville. Notre approche associe une connaissance fine du terrain aux standards de l'immobilier de luxe international : estimations précises, photographie éditoriale, confidentialité et suivi rigoureux.`}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image src={SIDE} alt="Riad" fill sizes="45vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-charcoal py-24 text-white">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-12 px-5 md:px-10 lg:grid-cols-4">
          {[
            { v: `${settings.yearsExperience}+`, l: en ? "Years of experience" : "Années d'expérience" },
            { v: `${settings.propertiesSold}+`, l: "Transactions" },
            { v: `${settings.activeProperties}+`, l: en ? "Active listings" : "Biens actifs" },
            { v: `${settings.clientCount}+`, l: en ? "Neighborhoods" : "Quartiers couverts" },
          ].map((s) => (
            <Reveal key={s.l}>
              <p className="font-display text-[46px] leading-none text-champagne">{s.v}</p>
              <p className="label-xs mt-4 text-white/60">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <div className="grid gap-px bg-sand md:grid-cols-3">
          {values.map((v) => (
            <Reveal key={v.en}>
              <div className="h-full bg-warm p-9">
                <h3 className="font-display text-[26px]">{en ? v.en : v.fr}</h3>
                <p className="mt-4 text-[14.5px] leading-relaxed text-muted">{en ? v.den : v.dfr}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {team.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
          <p className="label-xs text-champagne">{en ? "Our team" : "Notre équipe"}</p>
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
                  <p className="mt-5 text-[18px] font-medium group-hover:text-champagne">{a.name}</p>
                  <p className="mt-1 text-[13px] text-muted">{a.jobTitle}</p>
                  <p className="mt-4 line-clamp-3 text-[13.5px] text-muted">{pick(lang, a.bioFr, a.bioEn)}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-stone py-20">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-8 px-5 md:px-10">
          <h2 className="display max-w-xl text-[30px] sm:text-[42px]">
            {en ? "Let's discuss your project." : "Discutons de votre projet."}
          </h2>
          <Link href="/contact" className="label-xs bg-charcoal px-10 py-4 text-white hover:bg-champagne">
            {en ? "Contact us" : "Nous contacter"}
          </Link>
        </div>
      </section>
    </>
  );
}
