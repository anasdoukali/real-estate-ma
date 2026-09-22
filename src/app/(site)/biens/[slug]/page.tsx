import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/site/PropertyGallery";
import PropertyActions from "@/components/site/PropertyActions";
import InquiryForm from "@/components/site/InquiryForm";
import SingleMap from "@/components/site/SingleMap";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import { pick } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getPropertyBySlug, getSettings, listProperties } from "@/lib/queries";
import { toCard, toPoint } from "@/lib/mappers";
import { featureLabel, formatPrice, propertyTypeLabel } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Bien introuvable" };
  const title = `${property.titleFr} — ${property.neighborhood?.name ?? "Marrakech"}`;
  const description = (property.descriptionFr ?? "").slice(0, 180);
  const images = property.coverImage ? [property.coverImage] : [];
  return {
    title,
    description,
    alternates: { canonical: `/biens/${property.slug}` },
    openGraph: {
      title,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const en = lang === "en";
  const property = await getPropertyBySlug(slug);
  if (!property || property.status === "draft" || property.status === "archived") notFound();

  const settings = await getSettings();
  const similar = await listProperties({
    type: property.propertyType,
    transaction: property.transactionType,
    excludeId: property.id,
    limit: 3,
  });

  const title = pick(lang, property.titleFr, property.titleEn);
  const description = pick(lang, property.descriptionFr, property.descriptionEn);
  // Some older listings store their equipment list at the end of the description.
  const equipmentHeading = /(?:^|\n)\s*(?:Équipements(?:\s*\/\s*caractéristiques)?|Equipements(?:\s*\/\s*caracteristiques)?|Features(?:\s*\/\s*amenities)?|Amenities)\s*:?\s*\n/i;
  const equipmentMatch = equipmentHeading.exec(description ?? "");
  const descriptionText = equipmentMatch
    ? (description ?? "").slice(0, equipmentMatch.index).trim()
    : description;
  const equipmentText = equipmentMatch
    ? (description ?? "").slice(equipmentMatch.index + equipmentMatch[0].length).trim()
    : "";
  const equipment = Array.from(new Set([
    ...property.features.map((feature) => featureLabel(feature, lang)),
    ...equipmentText.split(/[•\n]+/).map((item) => item.trim().replace(/^[-–]\s*/, "")).filter(Boolean),
  ]));

  const agent = property.agent;
  const waNumber = (agent?.whatsapp || settings.whatsapp || "").replace(/[^0-9]/g, "");
  const waMessage = en
    ? `Hello, I am interested in property ${property.reference} — ${title}. Could you send me more information?`
    : `Bonjour, je suis intéressé(e) par le bien ${property.reference} — ${title}. Pouvez-vous m'envoyer plus d'informations ?`;
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const priceStr =
    property.priceType === "on_request"
      ? en
        ? "Price on request"
        : "Prix sur demande"
      : `${property.priceType === "starting_from" ? (en ? "From " : "À partir de ") : ""}${formatPrice(
          property.price,
          property.currency,
          lang,
        )}${
          property.transactionType === "rent" ? (en ? " / month" : " / mois") : ""
        }`;

  const specs = [
    { value: property.livingArea ? `${property.livingArea} m²` : null, label: en ? "Living area" : "Surface" },
    { value: property.landArea ? `${property.landArea} m²` : null, label: en ? "Land" : "Terrain" },
    { value: property.bedrooms, label: en ? "Bedrooms" : "Chambres" },
    { value: property.bathrooms, label: en ? "Bathrooms" : "Salles de bain" },
    { value: property.garages, label: "Garages" },
    { value: property.yearBuilt, label: en ? "Year built" : "Construction" },
  ].filter((s) => s.value);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    description,
    url: `/biens/${property.slug}`,
    image: property.images.map((i) => i.imageUrl),
    offers: {
      "@type": "Offer",
      price: Number(property.price),
      priceCurrency: property.currency,
    },
  };

  return (
    <div className="bg-warm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pt-[72px] md:pt-[86px]">
        <div className="mx-auto max-w-[1600px] px-2 pt-8 md:px-4 md:pt-12">
          <PropertyGallery images={property.images} title={title} lang={lang} />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-8 border-b border-sand py-12">
          <div>
            <div className="flex flex-wrap gap-2">
              {property.isExclusive && (
                <span className="label-xs bg-charcoal px-3 py-1.5 text-white">{en ? "Exclusive" : "Exclusivité"}</span>
              )}
              <span className="label-xs bg-charcoal px-3 py-1.5 text-white">
                {property.transactionType === "rent" ? (en ? "For rent" : "À louer") : en ? "For sale" : "À vendre"}
              </span>
              {property.status === "sold" && (
                <span className="label-xs bg-red-700 px-3 py-1.5 text-white">{en ? "Sold" : "Vendu"}</span>
              )}
            </div>
            <h1 className="display mt-6 max-w-3xl text-[34px] sm:text-[48px]">{title}</h1>
            <p className="mt-4 text-[14px] text-secondary">
              {property.neighborhood?.name ? `${property.neighborhood.name} • ` : ""}
              {property.city} · {en ? "Ref." : "Réf."} {property.reference}
            </p>
          </div>
          <div className="text-left lg:text-right">
            <p className="font-display text-[36px] leading-none text-charcoal sm:text-[44px]">{priceStr}</p>
            <div className="mt-6">
              <PropertyActions id={property.id} lang={lang} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-px border-b border-sand bg-sand">
          {specs.map((s) => (
            <div key={s.label} className="min-w-[140px] flex-1 bg-warm px-5 py-8 text-center">
              <p className="font-display text-[28px] leading-none">{s.value}</p>
              <p className="label-xs mt-3 text-secondary">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-10 py-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)_minmax(0,1fr)] xl:gap-12">
          <div>
            {property.latitude && property.longitude && property.locationVisibility !== "hidden" && (
              <Reveal className="mb-16">
                <h2 className="label-xs text-accent">{en ? "Location" : "Localisation"}</h2>
                <p className="mt-3 text-[14px] text-secondary">
                  {property.locationVisibility === "approximate"
                    ? en
                      ? "Approximate location"
                      : "Localisation approximative"
                    : property.address}
                </p>
                <div className="mt-6 overflow-hidden border border-stone">
                  <SingleMap
                    points={[toPoint(property, lang)]}
                    center={{ lat: property.latitude, lng: property.longitude }}
                    height={420}
                  />
                </div>
              </Reveal>
            )}

            <Reveal>
              <h2 className="label-xs text-accent">{en ? "About this property" : "À propos"}</h2>
              <div className="mt-6 whitespace-pre-line text-[16px] leading-[1.9] text-ink/85">{descriptionText}</div>
            </Reveal>

            {property.videoUrl && (
              <Reveal className="mt-16">
                <h2 className="label-xs text-accent">{en ? "Video" : "Vidéo"}</h2>
                <div className="mt-6 aspect-video w-full">
                  <iframe src={property.videoUrl} className="h-full w-full" allowFullScreen title="video" />
                </div>
              </Reveal>
            )}
          </div>

          <div className="min-w-0">
            <Reveal>
              <h2 className="label-xs text-accent">{en ? "Features" : "Équipements"}</h2>
              {equipment.length > 0 ? (
                <ul className="mt-6 space-y-4">
                  {equipment.map((item) => (
                    <li key={item} className="flex items-start gap-3 border-b border-sand pb-4 text-[14.5px] leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-champagne" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-[14px] text-muted">{en ? "Contact us for equipment details." : "Contactez-nous pour connaître les équipements de ce bien."}</p>
              )}
            </Reveal>

            <Reveal className="mt-16">
              <h2 className="label-xs text-accent">{en ? "Details" : "Détails"}</h2>
              <dl className="mt-6 grid gap-x-4 gap-y-4 ">
                {[
                  [en ? "Reference" : "Référence", property.reference],
                  [en ? "Type" : "Type", propertyTypeLabel(property.propertyType, lang)],
                  [en ? "Transaction" : "Transaction", property.transactionType === "rent" ? (en ? "Rent" : "Location") : en ? "Sale" : "Vente"],
                  [en ? "Neighborhood" : "Quartier", property.neighborhood?.name ?? "—"],
                  [en ? "Living rooms" : "Salons", property.livingRooms ?? "—"],
                  [en ? "Floors" : "Étages", property.totalFloors ?? "—"],
                  [en ? "Year built" : "Année", property.yearBuilt ?? "—"],
                  [en ? "Status" : "Statut", property.status],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between border-b border-stone pb-3 text-[14px]">
                    <dt className="text-secondary">{k}</dt>
                    <dd className="font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

          </div>

          <aside className="min-w-0 lg:sticky lg:top-[110px]">
            <div className="border border-sand bg-white p-5 xl:p-7">
              {agent && (
                <div className="flex items-center gap-4 border-b border-stone pb-6">
                  <div className="relative h-16 w-16 overflow-hidden bg-stone">
                    {agent.photoUrl && <Image src={agent.photoUrl} alt={agent.name} fill sizes="64px" className="object-cover" />}
                  </div>
                  <div>
                    <Link href={`/agents/${agent.slug}`} className="text-[16px] font-medium hover:text-accent">
                      {agent.name}
                    </Link>
                    <p className="mt-1 text-[12.5px] text-secondary">{agent.jobTitle}</p>
                  </div>
                </div>
              )}
              <div className="mt-6 flex flex-col gap-2">
                {(agent?.phone || settings.phone) && (
                  <a
                    href={`tel:${agent?.phone ?? settings.phone}`}
                    className="label-xs border border-charcoal py-4 text-center transition-colors hover:bg-charcoal hover:text-white"
                  >
                    {agent?.phone ?? settings.phone}
                  </a>
                )}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="label-xs bg-[#25D366] py-4 text-center text-white transition-opacity hover:opacity-90"
                >
                  WhatsApp
                </a>
              </div>
              <div className="mt-7">
                <InquiryForm
                  lang={lang}
                  propertyId={property.id}
                  agentId={property.agentId}
                  defaultMessage={waMessage}
                />
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="border-t border-sand py-20">
            <h2 className="display text-[30px] sm:text-[40px]">{en ? "Similar properties" : "Biens similaires"}</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={toCard(p)} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-stone bg-surface lg:hidden">
        <a href={`tel:${agent?.phone ?? settings.phone}`} className="label-xs py-4 text-center">
          {en ? "Call" : "Appeler"}
        </a>
        <a href={waHref} target="_blank" rel="noreferrer" className="label-xs bg-[#25D366] py-4 text-center text-white">
          WhatsApp
        </a>
        <a href="#contact-form" className="label-xs bg-charcoal py-4 text-center text-white">
          Message
        </a>
      </div>
    </div>
  );
}
