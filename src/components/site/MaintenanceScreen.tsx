import Image from "next/image";
import type { AgencySettings } from "@/db/schema";

export default function MaintenanceScreen({ agency, description }: { agency: AgencySettings; description: string }) {
  return <main className="relative isolate min-h-svh bg-charcoal text-white">
    <Image src="https://images.pexels.com/photos/8134745/pexels-photo-8134745.jpeg?auto=compress&cs=tinysrgb&w=2400" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
    <div className="mx-auto grid min-h-svh max-w-[1500px] items-center gap-12 px-6 py-14 md:px-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
      <div>
        <Image src="/brand/louka-vendy-gold.png" alt={agency.agencyName} width={200} height={80} className="mb-16 h-auto w-[180px] object-contain" />
        <p className="label-xs text-white/80">{agency.agencyName} · Marrakech</p>
        <h1 className="display mt-6 text-[54px] sm:text-[80px] lg:text-[96px]">Coming soon.</h1>
        <h2 className="mt-6 text-xl font-semibold sm:text-2xl">Une nouvelle expérience se prépare.</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">Notre site fait peau neuve. Nous revenons très bientôt. Notre équipe reste à votre écoute pour votre projet immobilier.</p>
        <p className="mt-8 max-w-xl whitespace-pre-line text-base leading-relaxed text-white/90">{description}</p>
        <div className="mt-9 flex flex-wrap gap-4">{agency.email && <a href={`mailto:${agency.email}`} className="rounded-[20px] bg-white px-6 py-4 text-sm font-semibold text-charcoal hover:bg-sand">Contactez-nous</a>}{agency.phone && <a href={`tel:${agency.phone.replace(/[^+0-9]/g, "")}`} className="rounded-[20px] border border-white/60 px-6 py-4 text-sm hover:bg-white/10">{agency.phone}</a>}</div>
      </div>
      <div className="grid grid-cols-2 items-center gap-4"><div className="relative aspect-[3/4] overflow-hidden rounded-[20px]"><Image src="https://images.pexels.com/photos/9730025/pexels-photo-9730025.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Villa et espace extérieur" fill sizes="45vw" className="object-cover" /></div><div className="relative mt-16 aspect-[3/4] overflow-hidden rounded-[20px]"><Image src="https://images.pexels.com/photos/7005300/pexels-photo-7005300.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Intérieur lumineux" fill sizes="45vw" className="object-cover" /></div></div>
    </div>
  </main>;
}
