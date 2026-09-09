import type { PropertyWithRelations } from "./queries";
import type { CardProperty } from "@/components/PropertyCard";
import type { MapPoint } from "@/components/site/PropertyMap";
import { pick, type Lang } from "./i18n";

export function toCard(p: PropertyWithRelations): CardProperty {
  return {
    id: p.id,
    slug: p.slug,
    reference: p.reference,
    titleFr: p.titleFr,
    titleEn: p.titleEn,
    price: p.price,
    currency: p.currency,
    priceType: p.priceType,
    rentalFrequency: p.rentalFrequency,
    transactionType: p.transactionType,
    propertyType: p.propertyType,
    status: p.status,
    isExclusive: p.isExclusive,
    isNew: p.isNew,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    livingArea: p.livingArea,
    landArea: p.landArea,
    coverImage: p.coverImage,
    neighborhoodName: p.neighborhood?.name ?? null,
    city: p.city,
  };
}

export function toPoint(p: PropertyWithRelations, lang: Lang): MapPoint {
  return {
    id: p.id,
    slug: p.slug,
    title: pick(lang, p.titleFr, p.titleEn),
    price: p.price,
    currency: p.currency,
    transactionType: p.transactionType,
    propertyType: p.propertyType,
    latitude: p.locationVisibility === "hidden" ? null : p.latitude,
    longitude: p.locationVisibility === "hidden" ? null : p.longitude,
    image: p.coverImage,
    neighborhood: p.neighborhood?.name ?? null,
    bedrooms: p.bedrooms,
    livingArea: p.livingArea,
  };
}
