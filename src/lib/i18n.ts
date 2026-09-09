export type Lang = "fr" | "en";

type Dict = Record<string, { fr: string; en: string }>;

const dict: Dict = {
  nav_home: { fr: "Accueil", en: "Home" },
  nav_buy: { fr: "Acheter", en: "Buy" },
  nav_rent: { fr: "Louer", en: "Rent" },
  nav_properties: { fr: "Propriétés", en: "Properties" },
  nav_neighborhoods: { fr: "Quartiers", en: "Neighborhoods" },
  nav_agency: { fr: "Agence", en: "Agency" },
  nav_contact: { fr: "Contact", en: "Contact" },
  nav_blog: { fr: "Journal", en: "Journal" },
  nav_cta: { fr: "Confiez-nous votre bien", en: "List your property" },
  favorites: { fr: "Favoris", en: "Favorites" },
  compare: { fr: "Comparer", en: "Compare" },
  search: { fr: "Rechercher", en: "Search" },
  more_filters: { fr: "Plus de critères", en: "More filters" },
  buy: { fr: "Acheter", en: "Buy" },
  rent: { fr: "Louer", en: "Rent" },
  property_type: { fr: "Type de bien", en: "Property type" },
  neighborhood: { fr: "Quartier", en: "Neighborhood" },
  budget: { fr: "Budget", en: "Budget" },
  bedrooms: { fr: "Chambres", en: "Bedrooms" },
  bathrooms: { fr: "Salles de bain", en: "Bathrooms" },
  surface: { fr: "Surface", en: "Living area" },
  land: { fr: "Terrain", en: "Land" },
  garages: { fr: "Garages", en: "Garages" },
  year: { fr: "Construction", en: "Year built" },
  all: { fr: "Tous", en: "All" },
  view_all: { fr: "Voir tous les biens", en: "View all properties" },
  results_found: { fr: "biens trouvés", en: "properties found" },
  sort_recent: { fr: "Plus récents", en: "Most recent" },
  sort_price_asc: { fr: "Prix croissant", en: "Price ascending" },
  sort_price_desc: { fr: "Prix décroissant", en: "Price descending" },
  sort_surface: { fr: "Surface", en: "Surface" },
  grid: { fr: "Grille", en: "Grid" },
  list: { fr: "Liste", en: "List" },
  map: { fr: "Carte", en: "Map" },
  request_info: { fr: "Demander des informations", en: "Request information" },
  send: { fr: "Envoyer", en: "Send" },
  name: { fr: "Nom", en: "Name" },
  firstname: { fr: "Prénom", en: "First name" },
  phone: { fr: "Téléphone", en: "Phone" },
  email: { fr: "Email", en: "Email" },
  message: { fr: "Message", en: "Message" },
  subscribe: { fr: "S'inscrire", en: "Subscribe" },
  your_email: { fr: "Votre adresse email", en: "Your email address" },
  about: { fr: "À propos", en: "About" },
  details: { fr: "Détails", en: "Details" },
  features: { fr: "Équipements", en: "Features" },
  location: { fr: "Localisation", en: "Location" },
  video: { fr: "Vidéo", en: "Video" },
  similar: { fr: "Biens similaires", en: "Similar properties" },
  for_sale: { fr: "À vendre", en: "For sale" },
  for_rent: { fr: "À louer", en: "For rent" },
  exclusive: { fr: "Exclusivité", en: "Exclusive" },
  new_badge: { fr: "Nouveau", en: "New" },
  sold: { fr: "Vendu", en: "Sold" },
  rented: { fr: "Loué", en: "Rented" },
  reference: { fr: "Référence", en: "Reference" },
  price_on_request: { fr: "Prix sur demande", en: "Price on request" },
  from_price: { fr: "À partir de", en: "From" },
  see_photos: { fr: "Voir les photos", en: "View photos" },
  call: { fr: "Appeler", en: "Call" },
  share: { fr: "Partager", en: "Share" },
  print: { fr: "Imprimer", en: "Print" },
  no_results: { fr: "Aucun bien ne correspond à votre recherche.", en: "No property matches your search." },
  estimation: { fr: "Estimation", en: "Valuation" },
  min_price: { fr: "Prix min", en: "Min price" },
  max_price: { fr: "Prix max", en: "Max price" },
  min_surface: { fr: "Surface min", en: "Min surface" },
  max_surface: { fr: "Surface max", en: "Max surface" },
  reset: { fr: "Réinitialiser", en: "Reset" },
};

export function t(key: keyof typeof dict | string, lang: Lang): string {
  const entry = dict[key];
  if (!entry) return String(key);
  return entry[lang];
}

export function pick(
  lang: Lang,
  fr: string | null | undefined,
  en: string | null | undefined,
): string {
  if (lang === "en") return (en && en.trim()) || fr || "";
  return (fr && fr.trim()) || en || "";
}
