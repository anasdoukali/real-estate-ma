export const PROPERTY_TYPES = [
  { value: "villa", fr: "Villa", en: "Villa", plural_fr: "Villas", plural_en: "Villas" },
  { value: "appartement", fr: "Appartement", en: "Apartment", plural_fr: "Appartements", plural_en: "Apartments" },
  { value: "riad", fr: "Riad", en: "Riad", plural_fr: "Riads", plural_en: "Riads" },
  { value: "maison", fr: "Maison", en: "House", plural_fr: "Maisons", plural_en: "Houses" },
  { value: "terrain", fr: "Terrain", en: "Land", plural_fr: "Terrains", plural_en: "Land" },
  { value: "bureau", fr: "Bureau", en: "Office", plural_fr: "Bureaux", plural_en: "Offices" },
  { value: "commerce", fr: "Commerce", en: "Commercial", plural_fr: "Commerces", plural_en: "Commercial" },
] as const;

export type PropertyTypeValue = (typeof PROPERTY_TYPES)[number]["value"];

export function propertyTypeLabel(value: string | null | undefined, lang: "fr" | "en") {
  const found = PROPERTY_TYPES.find((p) => p.value === value);
  if (!found) return value ?? "";
  return lang === "en" ? found.en : found.fr;
}

export function propertyTypePlural(value: string, lang: "fr" | "en") {
  const found = PROPERTY_TYPES.find((p) => p.value === value);
  if (!found) return value;
  return lang === "en" ? found.plural_en : found.plural_fr;
}

export const FEATURES = [
  { value: "piscine", fr: "Piscine", en: "Pool" },
  { value: "jardin", fr: "Jardin", en: "Garden" },
  { value: "climatisation", fr: "Climatisation", en: "Air conditioning" },
  { value: "terrasse", fr: "Terrasse", en: "Terrace" },
  { value: "garage", fr: "Garage", en: "Garage" },
  { value: "cuisine-equipee", fr: "Cuisine équipée", en: "Fitted kitchen" },
  { value: "golf", fr: "Golf", en: "Golf" },
  { value: "securite", fr: "Sécurité 24/7", en: "24/7 security" },
  { value: "vue-atlas", fr: "Vue Atlas", en: "Atlas view" },
  { value: "hammam", fr: "Hammam", en: "Hammam" },
  { value: "spa", fr: "Spa", en: "Spa" },
  { value: "salle-de-sport", fr: "Salle de sport", en: "Gym" },
  { value: "meuble", fr: "Meublé", en: "Furnished" },
  { value: "parking", fr: "Parking", en: "Parking" },
  { value: "ascenseur", fr: "Ascenseur", en: "Elevator" },
  { value: "patio", fr: "Patio", en: "Patio" },
];

export function featureLabel(value: string, lang: "fr" | "en") {
  const f = FEATURES.find((x) => x.value === value);
  if (!f) return value;
  return lang === "en" ? f.en : f.fr;
}

export const PROPERTY_STATUSES = ["draft", "published", "sold", "rented", "archived"] as const;
export const LEAD_STATUSES = ["new", "contacted", "visit_scheduled", "negotiation", "closed", "lost"] as const;
export const VALUATION_STATUSES = ["new", "contacted", "scheduled", "completed", "lost"] as const;

export const MARRAKECH_CENTER = { lat: 31.6295, lng: -7.9811 };

export function formatPrice(
  price: string | number | null | undefined,
  currency = "MAD",
  lang: "fr" | "en" = "fr",
) {
  const n = typeof price === "string" ? Number(price) : price ?? 0;
  if (!n || Number.isNaN(n)) return lang === "en" ? "Price on request" : "Prix sur demande";
  return `${new Intl.NumberFormat(lang === "en" ? "en-US" : "fr-FR").format(Math.round(n))} ${currency}`;
}

export function compactPrice(price: string | number | null | undefined, currency = "MAD") {
  const n = typeof price === "string" ? Number(price) : price ?? 0;
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(".0", "")}M ${currency}`;
  if (n >= 1000) return `${Math.round(n / 1000)}K ${currency}`;
  return `${n} ${currency}`;
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 180);
}
