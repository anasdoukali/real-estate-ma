import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import InquiryForm from "@/components/site/InquiryForm";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getAgentBySlug, listProperties } from "@/lib/queries";
import { toCard } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) return { title: "Agent" };
  const title = `${agent.name} — ${agent.jobTitle ?? "Conseiller immobilier"}`;
  const description = (agent.bioFr ?? "").slice(0, 180);
  const images = agent.photoUrl ? [agent.photoUrl] : [];
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const en = lang === "en";
  const agent = await getAgentBySlug(slug);
  if (!agent || !agent.active) notFound();

  const all = await listProperties({ limit: 60 });
  const own = all.filter((p) => p.agentId === agent.id);

  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-24 pt-[140px] md:px-10 md:pt-[180px]">
      <div className="grid gap-14 lg:grid-cols-[38%_62%]">
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone">
            {agent.photoUrl && <Image src={agent.photoUrl} alt={agent.name} fill sizes="40vw" className="object-cover" />}
          </div>
        </div>
        <div>
          <p className="label-xs text-accent">{agent.jobTitle}</p>
          <h1 className="display mt-4 text-[40px] sm:text-[58px]">{agent.name}</h1>
          {agent.languages && <p className="label-xs mt-5 text-secondary">{agent.languages}</p>}
          <p className="mt-8 max-w-2xl whitespace-pre-line text-[16px] leading-[1.9] text-ink/80">
            {pick(lang, agent.bioFr, agent.bioEn)}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {agent.phone && (
              <a href={`tel:${agent.phone}`} className="label-xs border border-charcoal px-7 py-4 hover:bg-charcoal hover:text-white">
                {agent.phone}
              </a>
            )}
            {agent.whatsapp && (
              <a
                href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="label-xs bg-[#25D366] px-7 py-4 text-white"
              >
                WhatsApp
              </a>
            )}
            {agent.email && (
              <a href={`mailto:${agent.email}`} className="label-xs border border-sand px-7 py-4 hover:border-charcoal">
                Email
              </a>
            )}
          </div>
          <div className="mt-12 max-w-lg border border-stone bg-surface p-7">
            <p className="label-xs text-accent">{en ? "Contact" : "Écrire à"} {agent.name}</p>
            <div className="mt-5">
              <InquiryForm lang={lang} agentId={agent.id} source="contact" />
            </div>
          </div>
        </div>
      </div>

      {own.length > 0 && (
        <div className="mt-24">
          <h2 className="display text-[30px] sm:text-[42px]">{en ? "Listings" : "Ses biens"}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {own.map((p) => (
              <PropertyCard key={p.id} property={toCard(p)} lang={lang} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
