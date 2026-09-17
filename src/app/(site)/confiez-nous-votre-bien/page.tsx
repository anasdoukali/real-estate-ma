import type { Metadata } from "next";
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
  return <><section className="bg-charcoal pb-20 pt-[150px] text-white md:pt-[190px]"><div className="mx-auto max-w-[1200px] px-5 md:px-10"><p className="label-xs text-accent">{en ? "Sell or rent" : "Vendre ou louer"}</p><h1 className="display mt-5 text-[38px] sm:text-[58px]">{en ? "List your property with us." : "Confiez-nous votre bien."}</h1><p className="mt-6 max-w-2xl text-white/70">{en ? "Tell us about your property and target price. An advisor will help you prepare your sale or rental." : "Présentez-nous votre bien et le prix souhaité. Un conseiller vous accompagne dans votre projet de vente ou de location."}</p><a href="/home-staging" className="mt-6 inline-block text-accent underline">{en ? "Discover Home Staging" : "Découvrez le Home Staging"} →</a></div></section><section className="mx-auto max-w-[1000px] px-5 py-16 md:px-10"><ServiceForm lang={lang} service="confier" neighborhoods={neighborhoods}/></section></>;
}
