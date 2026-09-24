import type { Metadata } from "next";
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
    <section className="mx-auto max-w-[1600px] px-5 pb-24 pt-[140px] md:px-10 md:pt-[180px]">
      <div className="grid gap-16 lg:grid-cols-[40%_60%]">
        <div>
          <p className="label-xs text-accent">Contact</p>
          <h1 className="display mt-5 text-[42px] sm:text-[60px]">
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
          </h1>
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
            className="label-xs inline-flex shrink-0 items-center gap-3 bg-charcoal px-8 py-5 text-white transition-colors hover:bg-champagne focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
          >
            {en ? "Contact us on WhatsApp" : "Nous écrire sur WhatsApp"}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    )}
    </>
  );
}
