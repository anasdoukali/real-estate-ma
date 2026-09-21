import type { Metadata } from "next";
import Link from "next/link";
import ServiceForm from "@/components/site/ServiceForm";
import { getLang } from "@/lib/lang";
import { listNeighborhoods } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Confiez-nous votre bien", description: "Vendez ou louez votre bien à Marrakech avec MAPYGO. Présentez votre projet à notre équipe." };
export default async function ListPropertyPage() {
  const lang = await getLang();
  const en = lang === "en";
  const neighborhoods = await loadPublicData(() => listNeighborhoods(), []);
  return (
    <>
      <section className="bg-charcoal pb-20 pt-[150px] text-white md:pt-[190px]">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <p className="label-xs text-accent">{en ? "Sell or rent" : "Vendre ou louer"}</p>
          <h1 className="display mt-5 text-[38px] sm:text-[58px]">
            {en ? "List your property with us." : "Confiez-nous votre bien."}
          </h1>
          <p className="mt-6 max-w-2xl text-white/70">
            {en
              ? "Tell us about your project and your desired price. A dedicated advisor will guide you from valuation through to signing."
              : "Présentez-nous votre projet et le prix souhaité. Un conseiller vous accompagne, de l'estimation jusqu'à la signature."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-5 py-16 md:px-10">
        <ServiceForm lang={lang} service="confier" neighborhoods={neighborhoods} />
      </section>

      <section className="bg-stone px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1000px]">
          <p className="label-xs text-accent">Home Staging</p>
          <h2 className="display mt-5 max-w-3xl text-[34px] sm:text-[46px]">
            {en ? "Reveal your property's potential." : "Révélez le potentiel de votre bien."}
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-secondary">
            {en
              ? "Decluttering, layout and styling: we prepare your property to help every visitor imagine living there."
              : "Désencombrement, réorganisation et décoration : nous préparons votre bien pour aider chaque visiteur à s'y projeter."}
          </p>
          <Link
            href="/home-staging"
            className="label-xs mt-8 inline-block bg-charcoal px-8 py-4 text-white transition-colors hover:bg-ink"
          >
            {en ? "Discover Home Staging" : "Découvrir le Home Staging"} →
          </Link>
        </div>
      </section>
    </>
  );
}
