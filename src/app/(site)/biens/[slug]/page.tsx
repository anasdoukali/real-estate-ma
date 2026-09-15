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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pt-[86px]">
        <div className="mx-auto max-w-[1600px] px-2 pt-4 md:px-4">
          <PropertyGallery images={property.images} title={title} lang={lang} />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-8 border-b border-sand py-12">
          <div>
            <div className="flex flex-wrap gap-2">
              {property.isExclusive && (
                <span className="label-xs bg-champagne px-3 py-1.5 text-white">{en ? "Exclusive" : "Exclusivité"}</span>
              )}
              <span className="label-xs bg-charcoal px-3 py-1.5 text-white">
                {property.transactionType === "rent" ? (en ? "For rent" : "À louer") : en ? "For sale" : "À vendre"}
              </span>
              {property.status === "sold" && (
                <span className="label-xs bg-red-700 px-3 py-1.5 text-white">{en ? "Sold" : "Vendu"}</span>
              )}
            </div>
            <h1 className="display mt-6 max-w-3xl text-[34px] sm:text-[48px]">{title}</h1>
            <p className="mt-4 text-[14px] text-muted">
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

        <div className="grid grid-cols-2 gap-px border-b border-sand bg-sand md:grid-cols-3 lg:grid-cols-6">
          {specs.map((s) => (
            <div key={s.label} className="bg-warm px-5 py-8 text-center">
              <p className="font-display text-[28px] leading-none">{s.value}</p>
              <p className="label-xs mt-3 text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-16 py-16 lg:grid-cols-[64%_36%]">
          <div>
            <Reveal>
              <h2 className="label-xs text-champagne">{en ? "About this property" : "À propos"}</h2>
              <div className="mt-6 whitespace-pre-line text-[16px] leading-[1.9] text-ink/85">{description}</div>
            </Reveal>

            <Reveal className="mt-16">
              <h2 className="label-xs text-champagne">{en ? "Details" : "Détails"}</h2>
              <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
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
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {property.features.length > 0 && (
              <Reveal className="mt-16">
                <h2 className="label-xs text-champagne">{en ? "Features" : "Équipements"}</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {property.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-[14.5px]">
                      <span className="h-1.5 w-1.5 bg-champagne" />
                      {featureLabel(f, lang)}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {property.latitude && property.longitude && property.locationVisibility !== "hidden" && (
              <Reveal className="mt-16">
                <h2 className="label-xs text-champagne">{en ? "Location" : "Localisation"}</h2>
                <p className="mt-3 text-[14px] text-muted">
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

            {property.videoUrl && (
              <Reveal className="mt-16">
                <h2 className="label-xs text-champagne">{en ? "Video" : "Vidéo"}</h2>
                <div className="mt-6 aspect-video w-full">
                  <iframe src={property.videoUrl} className="h-full w-full" allowFullScreen title="video" />
                </div>
              </Reveal>
            )}
          </div>

          <aside>
            <div className="sticky top-[110px] border border-stone bg-white p-7">
              {agent && (
                <div className="flex items-center gap-4 border-b border-stone pb-6">
                  <div className="relative h-16 w-16 overflow-hidden bg-stone">
                    {agent.photoUrl && <Image src={agent.photoUrl} alt={agent.name} fill sizes="64px" className="object-cover" />}
                  </div>
                  <div>
                    <Link href={`/agents/${agent.slug}`} className="text-[16px] font-medium hover:text-champagne">
                      {agent.name}
                    </Link>
                    <p className="mt-1 text-[12.5px] text-muted">{agent.jobTitle}</p>
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
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-stone bg-white lg:hidden">
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
    </>
  );
}
