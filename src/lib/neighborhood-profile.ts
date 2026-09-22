export const NEIGHBORHOOD_RATINGS = [
  { key: "amenities", fr: "Commodités", en: "Amenities" },
  { key: "restaurants", fr: "Restaurants / hôtels", en: "Restaurants / hotels" },
  { key: "shops", fr: "Commerces", en: "Shops" },
  { key: "healthcare", fr: "Santé", en: "Healthcare" },
  { key: "transport", fr: "Transports / taxis", en: "Transport / taxis" },
  { key: "walkability", fr: "Vie à pied", en: "Walkability" },
  { key: "quietness", fr: "Calme", en: "Quietness" },
  { key: "prestige", fr: "Standing", en: "Prestige" },
  { key: "rentalPotential", fr: "Potentiel locatif premium", en: "Premium rental potential" },
] as const;

export const NEIGHBORHOOD_TRAITS = [
  { key: "greenery", fr: "Verdure", en: "Green spaces", placeholder: "Grande" },
  { key: "parking", fr: "Parking quotidien", en: "Daily parking", placeholder: "Normal / Difficile" },
  { key: "traffic", fr: "Circulation", en: "Traffic", placeholder: "Forte par périodes" },
  { key: "distanceGueliz", fr: "Distance Guéliz", en: "Distance to Guéliz", placeholder: "≈ 1–2 km" },
  { key: "distanceJemaaElFna", fr: "Distance Jemaa el-Fna", en: "Distance to Jemaa el-Fna", placeholder: "≈ 2 km" },
  { key: "distanceAirport", fr: "Distance aéroport", en: "Distance to the airport", placeholder: "≈ 4–5 km" },
] as const;

export type NeighborhoodProfile = {
  ratings?: Partial<Record<(typeof NEIGHBORHOOD_RATINGS)[number]["key"], number>>;
  traits?: Partial<Record<(typeof NEIGHBORHOOD_TRAITS)[number]["key"], { fr: string; en: string }>>;
};

export function parseNeighborhoodProfile(form: FormData): NeighborhoodProfile {
  const ratings: NonNullable<NeighborhoodProfile["ratings"]> = {};
  for (const { key } of NEIGHBORHOOD_RATINGS) {
    const raw = String(form.get("rating_" + key) ?? "").trim();
    if (!raw) continue;
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error("Les notes doivent être comprises entre 1 et 5.");
    }
    ratings[key] = value;
  }
  const traits: NonNullable<NeighborhoodProfile["traits"]> = {};
  for (const { key } of NEIGHBORHOOD_TRAITS) {
    if (key.startsWith("distance") && form.has(key)) {
      const value = String(form.get(key) ?? "").trim();
      if (value.length > 160) throw new Error("Les critères sont limités à 160 caractères.");
      if (value) traits[key] = { fr: value, en: value };
      continue;
    }
    const fr = String(form.get(key + "_fr") ?? "").trim();
    const en = String(form.get(key + "_en") ?? "").trim();
    if (fr.length > 160 || en.length > 160) throw new Error("Les critères sont limités à 160 caractères.");
    if (fr || en) traits[key] = { fr, en };
  }
  return { ratings, traits };
}
