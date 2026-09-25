import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/site/ContactForm";
import { getLang } from "@/lib/lang";
import { DEFAULT_AGENCY_SETTINGS, getSettings } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — parlons de votre projet immobilier à Marrakech",
  description: "Contactez notre équipe pour acheter, vendre, louer ou investir à Marrakech.",
};

export default async function ContactPage() {
  const lang = await getLang();
  const en = lang === "en";
  const settings = await loadPublicData(() => getSettings(), DEFAULT_AGENCY_SETTINGS);

  return (
    <>
    <section className="relative mt-[72px] h-[40vh] min-h-[280px] max-h-[480px] overflow-hidden md:mt-[86px]">
      <Image
        src="/contact-cover-warm.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_55%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-12 md:px-10 md:pb-16">
        <p className="label-xs text-white/80">Louka & Vendy · Marrakech</p>
        <h1 className="display mt-4 text-[44px] text-white sm:text-[68px]">Contact</h1>
      </div>
    </section>
    <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <p className="label-xs text-accent">Contact</p>
          <h2 className="display mt-5 text-[42px] sm:text-[60px]">
            {en ? (
              <>
                Let&apos;s talk about
                <br />
                your project.
              </>
            ) : (
              <>
                Parlons de
                <br />
                votre projet.
              </>
            )}
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-secondary">
            {en
              ? "A question, a property to visit, a project to develop: our team will get back to you promptly."
              : "Une question, un bien à visiter, un projet à construire : notre équipe vous répond rapidement."}
          </p>
          <div className="mt-12 space-y-6 text-[14.5px]">
            {settings.phone && (
              <div>
                <p className="label-xs text-secondary">{en ? "Phone" : "Téléphone"}</p>
                <a href={`tel:${settings.phone}`} className="mt-2 block text-[18px] hover:text-accent">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.whatsapp && (
              <div>
                <p className="label-xs text-secondary">WhatsApp</p>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-[18px] hover:text-accent"
                >
                  {settings.whatsapp}
                </a>
              </div>
            )}
            {settings.email && (
              <div>
                <p className="label-xs text-secondary">Email</p>
                <a href={`mailto:${settings.email}`} className="mt-2 block text-[18px] hover:text-accent">
                  {settings.email}
                </a>
              </div>
            )}
            {settings.address && (
              <div>
                <p className="label-xs text-secondary">{en ? "Office" : "Bureau"}</p>
                <p className="mt-2 text-[18px]">{settings.address}</p>
              </div>
            )}
          </div>
        </div>
        <div className="contact-form-panel border border-stone bg-surface p-7 md:p-12">
          <ContactForm lang={lang} />
        </div>
      </div>
    </section>
    {settings.whatsapp && (
      <section className="bg-white px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="label-xs text-champagne">WhatsApp</p>
            <h2 className="display mt-5 text-[32px] sm:text-[44px]">
              {en ? "Let's talk on WhatsApp." : "Échangeons sur WhatsApp."}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              {en
                ? "A question about a property or your project? Send our team a message directly."
                : "Une question sur un bien ou votre projet ? Écrivez directement à notre équipe."}
            </p>
          </div>
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(en ? "Hello, I would like to discuss my property project." : "Bonjour, je souhaite échanger sur mon projet immobilier.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="label-xs inline-flex shrink-0 items-center gap-3 bg-charcoal px-8 py-5 text-white transition-colors hover:bg-[#25D366] hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
          >
            WhatsApp
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.53 3.75 1.45 5.31L2 22l4.98-1.6a9.8 9.8 0 0 0 5.06 1.4c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2Zm5.7 13.9c-.24.68-1.4 1.3-1.93 1.34-.5.05-.98.24-3.3-.7-2.77-1.13-4.53-3.98-4.67-4.17-.13-.19-1.1-1.48-1.1-2.83 0-1.34.7-2 .95-2.28.24-.27.53-.34.7-.34h.5c.16 0 .38-.06.6.46.23.56.77 1.9.84 2.04.07.14.11.3.02.48-.09.19-.13.3-.26.47-.13.16-.28.36-.4.48-.13.14-.27.28-.12.55.15.27.68 1.12 1.46 1.81 1 .9 1.85 1.17 2.12 1.3.27.14.42.11.58-.07.16-.19.67-.78.85-1.05.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.87.27.14.45.2.51.32.07.11.07.65-.17 1.33Z" />
            </svg>
          </a>
        </div>
      </section>
    )}
    </>
  );
}
