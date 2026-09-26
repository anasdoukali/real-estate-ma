import type { Metadata } from "next";
import Image from "next/image";
import ServiceForm from "@/components/site/ServiceForm";
import { getLang } from "@/lib/lang";
import { listNeighborhoods } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Home Staging à Marrakech", description: "Mettez en valeur votre bien avant sa vente ou sa location : désencombrement, aménagement et décoration. Demandez votre devis personnalisé." };

export default async function HomeStagingPage() {
  const lang = await getLang();
  const en = lang === "en";
  const neighborhoods = await loadPublicData(() => listNeighborhoods(), []);
  const services = en ? [
    ["Declutter", "Simplify each room so visitors can imagine themselves at home."],
    ["Reorganise", "Improve circulation, highlight space and make the most of natural light."],
    ["Style", "Create a welcoming, neutral setting with decoration and temporary furniture as needed."],
  ] : [
    ["Désencombrer", "Alléger chaque pièce pour permettre aux visiteurs de se projeter facilement."],
    ["Réorganiser", "Fluidifier la circulation, révéler les volumes et valoriser la lumière naturelle."],
    ["Décorer", "Créer une ambiance neutre et accueillante avec de la décoration et, selon les besoins, du mobilier temporaire."],
  ];
  return <>
    <section className="bg-charcoal pb-20 pt-[150px] text-white md:pt-[190px]"><div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 md:grid-cols-2 md:px-10"><div><p className="label-xs text-accent">Home Staging · Marrakech</p><h1 className="display mt-5 text-[38px] sm:text-[54px]">{en ? "Reveal your property's potential." : "Révélez le potentiel de votre bien."}</h1><p className="mt-6 text-[16px] leading-relaxed text-white/70">{en ? "A bright, thoughtfully designed interior helps every visitor envision themselves in the space, both in photos and during viewings. We prepare your property to sell or rent faster." : "Un intérieur lumineux et bien pensé aide chaque visiteur à se projeter, en photo comme en visite. Nous préparons votre bien pour vendre ou louer plus vite."}</p><a href="#devis" className="label-xs mt-8 inline-block rounded-[20px] bg-charcoal px-7 py-4 text-white">{en ? "Request a quote" : "Demander un devis"}</a></div><div className="relative min-h-[340px] overflow-hidden rounded-[20px]"><Image src="https://images.pexels.com/photos/7005300/pexels-photo-7005300.jpeg?auto=compress&cs=tinysrgb&w=1200" alt={en ? "Bright, welcoming interior" : "Intérieur lumineux et accueillant"} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover"/></div></div></section>
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10"><h2 className="font-display text-3xl">{en ? "A Decisive First Impression.." : "Une première impression décisive."}</h2><p className="mt-4 max-w-3xl text-secondary">{en ? "Our goal: to protect and enhance the value of your property through a carefully curated presentation, from the first click to the viewing." : "Notre objectif : défendre la valeur de votre bien grâce à une présentation soignée, du premier clic à la visite."}</p><div className="mt-10 grid gap-6 md:grid-cols-3">{services.map(([title, description], i) => <article key={title} className="rounded-[20px] border border-sand p-7"><p className="label-xs text-accent">0{i + 1}</p><h3 className="mt-4 font-display text-2xl">{title}</h3><p className="mt-3 leading-relaxed text-secondary">{description}</p></article>)}</div></section>
    <section id="devis" className="scroll-mt-28 bg-white py-20 md:py-24"><div className="mx-auto max-w-[1000px] px-5 md:px-10"><h2 className="mb-8 font-display text-3xl">{en ? "Your personalised Home Staging quote" : "Votre devis Home Staging personnalisé"}</h2><ServiceForm lang={lang} service="home-staging" neighborhoods={neighborhoods}/></div></section>
  </>;
}
