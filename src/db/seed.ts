import "dotenv/config";
import { db, pool } from "./index";
import {
  adminUsers,
  agencySettings,
  agents,
  articles,
  neighborhoods,
  properties,
  propertyFeatures,
  propertyImages,
  testimonials,
} from "./schema";
import { hashPassword } from "../lib/auth";
import { slugify } from "../lib/site";

const px = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const VILLA = [12715498, 8134745, 9730025, 12715491, 8484851, 36710315, 8134753, 7061420];
const INTERIOR = [31817164, 31817155, 7031622, 6283965, 6283963, 7005300, 6957083];
const RIAD = [10573397, 38891222, 15260622, 998655, 27945049];
const CITY = [25489943, 38785630, 38787221, 15360707, 35156066, 2610815];

const hoodData = [
  { name: "Palmeraie", descriptor: "Villas, domaines & propriétés confidentielles", desc: "La Palmeraie est l'adresse historique des grandes propriétés marrakchies. Domaines arborés, villas d'architecte et hôtels de charme se partagent une palmeraie de plusieurs milliers d'hectares, à quinze minutes du centre.", lat: 31.6725, lng: -7.9528, img: px(9730025) },
  { name: "Hivernage", descriptor: "Appartements de standing, hôtels & vie nocturne", desc: "Quartier résidentiel élégant né dans les années 1920, l'Hivernage réunit palaces, résidences sécurisées et restaurants, à quelques minutes de la Médina.", lat: 31.6255, lng: -8.0089, img: px(8484851) },
  { name: "Guéliz", descriptor: "Le cœur moderne et culturel de la ville", desc: "Guéliz est la ville nouvelle : galeries d'art, concept stores, terrasses et immeubles récents avec vues sur l'Atlas. Le meilleur compromis entre vie urbaine et investissement locatif.", lat: 31.6363, lng: -8.0122, img: px(7005300) },
  { name: "Amelkis", descriptor: "Villas sur golf et sécurité 24/7", desc: "Amelkis est un domaine golfique fermé, réputé pour ses villas contemporaines, ses vues sur l'Atlas et sa tranquillité absolue.", lat: 31.5807, lng: -7.9426, img: px(12715491) },
  { name: "Agdal", descriptor: "Familles, écoles et grandes résidences", desc: "Entre jardins historiques et résidences familiales, l'Agdal séduit par ses grands espaces verts et sa proximité avec les écoles internationales.", lat: 31.5936, lng: -7.9814, img: px(36710315) },
  { name: "Médina", descriptor: "Riads historiques et patrimoine", desc: "La Médina classée UNESCO abrite les riads : patios, zelliges, tadelakt et terrasses ouvertes sur la Koutoubia.", lat: 31.6295, lng: -7.9891, img: px(38891222) },
  { name: "Targa", descriptor: "Résidentiel calme et villas familiales", desc: "Targa est un quartier résidentiel apprécié pour ses villas spacieuses, ses écoles et son rapport qualité-prix.", lat: 31.6462, lng: -8.0501, img: px(6283965) },
  { name: "Route de l'Ourika", descriptor: "Grandes propriétés face à l'Atlas", desc: "La route de l'Ourika offre des terrains généreux et des vues dégagées sur les sommets enneigés de l'Atlas.", lat: 31.5502, lng: -7.9349, img: px(12715498) },
  { name: "Route de Fès", descriptor: "Domaines, oliveraies et projets neufs", desc: "Un axe en plein développement, prisé pour les domaines agricoles reconvertis et les projets résidentiels neufs.", lat: 31.6821, lng: -7.9251, img: px(15360707) },
  { name: "Route de Casablanca", descriptor: "Investissement et projets résidentiels", desc: "Axe stratégique entre l'aéroport et le nord de la ville, propice à l'investissement locatif et aux programmes neufs.", lat: 31.6690, lng: -8.0263, img: px(35156066) },
];

const agentData = [
  {
    name: "Yasmine Bennani",
    jobTitle: "Directrice associée",
    phone: "+212 661 12 34 56",
    whatsapp: "+212661123456",
    email: "yasmine@agency.ma",
    languages: "Français · English · العربية",
    photo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=900",
    bioFr: "Née à Marrakech, Yasmine accompagne depuis douze ans une clientèle internationale sur les segments villa et domaine. Elle connaît chaque allée de la Palmeraie et chaque programme de la ville nouvelle.",
    bioEn: "Born in Marrakech, Yasmine has been advising international buyers on villas and estates for twelve years.",
  },
  {
    name: "Karim El Fassi",
    jobTitle: "Conseiller immobilier senior",
    phone: "+212 662 98 76 54",
    whatsapp: "+212662987654",
    email: "karim@agency.ma",
    languages: "Français · English · Español",
    photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=900",
    bioFr: "Spécialiste des riads et du patrimoine de la Médina, Karim pilote les projets de rénovation et les acquisitions confidentielles.",
    bioEn: "A riad and Medina heritage specialist, Karim leads renovation projects and off-market acquisitions.",
  },
  {
    name: "Sofia Marchetti",
    jobTitle: "Conseillère location & investissement",
    phone: "+212 663 45 67 89",
    whatsapp: "+212663456789",
    email: "sofia@agency.ma",
    languages: "Français · English · Italiano",
    photo: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=900",
    bioFr: "Sofia conseille les investisseurs sur la location longue durée et saisonnière, avec une lecture précise des rendements par quartier.",
    bioEn: "Sofia advises investors on long-term and seasonal rentals with a precise reading of yields by district.",
  },
];

type P = {
  title: string;
  titleEn: string;
  type: string;
  transaction: "sale" | "rent";
  price: number;
  hood: string;
  bedrooms: number;
  bathrooms: number;
  living: number;
  land?: number;
  year?: number;
  featured?: boolean;
  exclusive?: boolean;
  imgs: number[];
  features: string[];
  desc: string;
  descEn: string;
};

const propertyData: P[] = [
  { title: "Villa contemporaine sur le golf", titleEn: "Contemporary villa on the golf course", type: "villa", transaction: "sale", price: 6500000, hood: "Amelkis", bedrooms: 4, bathrooms: 4, living: 320, land: 850, year: 2021, featured: true, exclusive: true, imgs: [VILLA[0], INTERIOR[0], VILLA[1], INTERIOR[1], RIAD[4], VILLA[2]], features: ["piscine", "jardin", "climatisation", "golf", "securite", "vue-atlas", "cuisine-equipee", "garage"], desc: "Posée en première ligne du golf d'Amelkis, cette villa d'architecte déploie 320 m² habitables sur un terrain paysagé de 850 m². Volumes traversants, tadelakt clair, baies coulissantes toute hauteur et piscine à débordement orientée plein sud sur l'Atlas.", descEn: "Set on the first line of the Amelkis golf course, this architect-designed villa offers 320 sqm of living space on an 850 sqm landscaped plot." },
  { title: "Villa d'architecte dans la Palmeraie", titleEn: "Architect villa in the Palmeraie", type: "villa", transaction: "sale", price: 12900000, hood: "Palmeraie", bedrooms: 6, bathrooms: 6, living: 620, land: 4000, year: 2019, featured: true, exclusive: true, imgs: [VILLA[2], INTERIOR[2], VILLA[3], INTERIOR[3], VILLA[4]], features: ["piscine", "jardin", "hammam", "spa", "salle-de-sport", "securite", "climatisation", "garage"], desc: "Un domaine confidentiel de 4 000 m² planté de palmiers centenaires. Six suites, hammam, spa, salle de sport, patio d'eau et pavillon d'invités. Une écriture architecturale sobre, minérale, résolument contemporaine.", descEn: "A confidential 4,000 sqm estate planted with century-old palm trees, featuring six suites, hammam, spa and gym." },
  { title: "Appartement d'angle à l'Hivernage", titleEn: "Corner apartment in Hivernage", type: "appartement", transaction: "sale", price: 3100000, hood: "Hivernage", bedrooms: 3, bathrooms: 2, living: 148, year: 2020, featured: true, imgs: [INTERIOR[5], INTERIOR[4], VILLA[5]], features: ["climatisation", "terrasse", "parking", "ascenseur", "securite"], desc: "Au quatrième étage d'une résidence sécurisée, cet appartement d'angle profite d'une double exposition et d'une terrasse de 28 m² ouverte sur les jardins.", descEn: "On the fourth floor of a secure residence, this corner apartment enjoys dual aspect and a 28 sqm terrace." },
  { title: "Penthouse avec vue Atlas à Guéliz", titleEn: "Penthouse with Atlas view in Guéliz", type: "appartement", transaction: "sale", price: 5200000, hood: "Guéliz", bedrooms: 3, bathrooms: 3, living: 210, year: 2022, featured: true, imgs: [INTERIOR[6], INTERIOR[1], VILLA[6]], features: ["terrasse", "climatisation", "ascenseur", "parking", "vue-atlas", "cuisine-equipee"], desc: "Dernier étage, 210 m² habitables prolongés par une terrasse panoramique de 90 m² avec bassin. Vue dégagée sur la chaîne de l'Atlas.", descEn: "Top floor, 210 sqm extended by a 90 sqm panoramic terrace with plunge pool and open Atlas views." },
  { title: "Riad rénové au cœur de la Médina", titleEn: "Restored riad in the heart of the Medina", type: "riad", transaction: "sale", price: 8500000, hood: "Médina", bedrooms: 5, bathrooms: 5, living: 380, land: 300, year: 1920, featured: true, exclusive: true, imgs: [RIAD[1], RIAD[0], RIAD[2], RIAD[4]], features: ["piscine", "patio", "hammam", "terrasse", "climatisation"], desc: "Riad du début du XXe siècle entièrement restauré : patio à quatre orangers, zelliges d'origine, cinq suites, hammam traditionnel et terrasse avec vue Koutoubia.", descEn: "Early 20th-century riad fully restored: four-orange-tree patio, original zellige, five suites and a Koutoubia-view rooftop." },
  { title: "Villa familiale route de l'Ourika", titleEn: "Family villa on the Ourika road", type: "villa", transaction: "sale", price: 9200000, hood: "Route de l'Ourika", bedrooms: 5, bathrooms: 5, living: 480, land: 5000, year: 2018, imgs: [VILLA[3], INTERIOR[3], VILLA[7], INTERIOR[6]], features: ["piscine", "jardin", "vue-atlas", "securite", "garage", "cuisine-equipee"], desc: "Sur cinq mille mètres carrés d'oliviers, une villa lumineuse de plain-pied avec piscine chauffée, pool house et vue frontale sur l'Atlas.", descEn: "On 5,000 sqm of olive trees, a bright single-storey villa with heated pool, pool house and frontal Atlas views." },
  { title: "Villa neuve à Targa", titleEn: "New villa in Targa", type: "villa", transaction: "sale", price: 4300000, hood: "Targa", bedrooms: 4, bathrooms: 3, living: 300, land: 500, year: 2023, imgs: [VILLA[5], INTERIOR[0], VILLA[1]], features: ["piscine", "jardin", "climatisation", "garage", "cuisine-equipee"], desc: "Villa neuve livrée avec finitions haut de gamme, jardin paysager et piscine. Quartier résidentiel calme, proche des écoles internationales.", descEn: "Brand-new villa delivered with high-end finishes, landscaped garden and pool in a quiet residential district." },
  { title: "Terrain constructible à la Palmeraie", titleEn: "Building plot in the Palmeraie", type: "terrain", transaction: "sale", price: 3800000, hood: "Palmeraie", bedrooms: 0, bathrooms: 0, living: 0, land: 3000, imgs: [CITY[2], VILLA[2]], features: ["vue-atlas"], desc: "Terrain plat de 3 000 m², titré, viabilisé, au sein d'un lotissement fermé de la Palmeraie. Coefficient d'emprise autorisant une villa de 600 m².", descEn: "Flat, titled and serviced 3,000 sqm plot within a gated Palmeraie development." },
  { title: "Appartement neuf à l'Agdal", titleEn: "New apartment in Agdal", type: "appartement", transaction: "sale", price: 1750000, hood: "Agdal", bedrooms: 2, bathrooms: 2, living: 96, year: 2024, imgs: [INTERIOR[4], INTERIOR[5]], features: ["climatisation", "ascenseur", "parking", "terrasse"], desc: "Deux chambres, séjour lumineux et terrasse plein sud dans une résidence neuve avec piscine collective et gardiennage.", descEn: "Two bedrooms, a bright living room and a south-facing terrace in a new residence with shared pool." },
  { title: "Maison de ville rénovée à Guéliz", titleEn: "Renovated townhouse in Guéliz", type: "maison", transaction: "sale", price: 2650000, hood: "Guéliz", bedrooms: 3, bathrooms: 2, living: 180, land: 140, year: 1975, imgs: [INTERIOR[3], INTERIOR[6], CITY[5]], features: ["terrasse", "climatisation", "patio", "cuisine-equipee"], desc: "Maison des années 1970 entièrement repensée : patio intérieur, cuisine ouverte, trois chambres et terrasse aménagée.", descEn: "A 1970s house fully reimagined with an interior patio, open kitchen and landscaped rooftop." },
  { title: "Villa à louer sur golf, Amelkis", titleEn: "Villa for rent on the golf, Amelkis", type: "villa", transaction: "rent", price: 45000, hood: "Amelkis", bedrooms: 4, bathrooms: 4, living: 330, land: 900, year: 2020, featured: true, imgs: [VILLA[1], INTERIOR[1], VILLA[6], INTERIOR[2]], features: ["piscine", "jardin", "meuble", "golf", "securite", "climatisation"], desc: "Location longue durée d'une villa meublée avec goût, piscine chauffée et personnel de maison possible. Disponible immédiatement.", descEn: "Long-term rental of a tastefully furnished villa with heated pool and optional household staff." },
  { title: "Appartement meublé à l'Hivernage", titleEn: "Furnished apartment in Hivernage", type: "appartement", transaction: "rent", price: 14000, hood: "Hivernage", bedrooms: 2, bathrooms: 2, living: 110, year: 2019, imgs: [INTERIOR[5], INTERIOR[0]], features: ["meuble", "climatisation", "ascenseur", "parking", "piscine"], desc: "Appartement meublé de deux chambres dans une résidence avec piscine, à deux pas des restaurants de l'Hivernage.", descEn: "Furnished two-bedroom apartment in a residence with pool, steps from Hivernage restaurants." },
  { title: "Riad d'hôtes à louer, Médina", titleEn: "Guest riad for rent, Medina", type: "riad", transaction: "rent", price: 32000, hood: "Médina", bedrooms: 6, bathrooms: 6, living: 400, year: 1930, imgs: [RIAD[0], RIAD[1], RIAD[3]], features: ["piscine", "patio", "terrasse", "meuble", "hammam"], desc: "Riad de six chambres, exploité en maison d'hôtes, disponible en location annuelle avec licence d'exploitation.", descEn: "Six-bedroom riad, operated as a guest house, available on an annual lease with operating licence." },
  { title: "Plateau de bureaux à Guéliz", titleEn: "Office floor in Guéliz", type: "bureau", transaction: "rent", price: 28000, hood: "Guéliz", bedrooms: 0, bathrooms: 2, living: 260, year: 2021, imgs: [INTERIOR[6], CITY[5]], features: ["climatisation", "ascenseur", "parking", "securite"], desc: "Plateau de 260 m² divisible, façade vitrée sur avenue, cinq places de parking en sous-sol.", descEn: "260 sqm divisible office floor with a glazed avenue frontage and five basement parking spaces." },
  { title: "Local commercial route de Casablanca", titleEn: "Retail unit on the Casablanca road", type: "commerce", transaction: "sale", price: 2200000, hood: "Route de Casablanca", bedrooms: 0, bathrooms: 1, living: 180, year: 2017, imgs: [CITY[1], CITY[5]], features: ["climatisation", "parking", "securite"], desc: "Local commercial en rez-de-chaussée d'immeuble, forte visibilité sur un axe très passant, actuellement loué.", descEn: "Ground-floor retail unit with strong visibility on a busy axis, currently leased." },
];

const articleData = [
  { titleFr: "Où investir à Marrakech en 2026 ?", titleEn: "Where to invest in Marrakech in 2026?", cat: "Investissement", img: px(15360707), excerptFr: "Rendements, quartiers émergents et typologies porteuses : notre lecture du marché marrakchi pour l'année à venir.", contentFr: "Le marché marrakchi entre dans une phase de maturité. Après plusieurs années de hausse rapide sur les segments villa et riad, la demande se déplace vers des produits mieux calibrés : appartements neufs à Guéliz et l'Agdal, villas compactes à Targa, et domaines confidentiels en Palmeraie.\n\nLes rendements locatifs longue durée oscillent aujourd'hui entre 4 et 6 % bruts selon le quartier, avec des pointes sur les biens meublés à l'Hivernage. La location saisonnière reste très performante en Médina, à condition de disposer d'une licence et d'une gestion professionnelle.\n\nNotre conseil : privilégier l'emplacement et la qualité de construction plutôt que la surface brute." },
  { titleFr: "Palmeraie ou Amelkis : où acheter une villa ?", titleEn: "Palmeraie or Amelkis: where to buy a villa?", cat: "Guide", img: px(9730025), excerptFr: "Deux adresses d'exception, deux philosophies. Comparaison détaillée pour un achat de villa à Marrakech.", contentFr: "La Palmeraie séduit par ses grands terrains, ses palmiers centenaires et son sentiment d'isolement. Amelkis répond par la sécurité d'un domaine fermé, le golf et une architecture plus contemporaine.\n\nCôté budget, comptez en moyenne 18 000 à 26 000 MAD/m² bâti en Palmeraie contre 15 000 à 22 000 MAD/m² à Amelkis. La Palmeraie offre davantage de potentiel de valorisation sur les très grands domaines ; Amelkis rassure les familles et les résidents à l'année." },
  { titleFr: "Investissement locatif à Marrakech : notre guide", titleEn: "Rental investment in Marrakech: our guide", cat: "Investissement", img: px(7005300), excerptFr: "Fiscalité, gestion, rendement, saisonnalité : tout ce qu'il faut savoir avant de louer votre bien.", contentFr: "Louer à Marrakech suppose de choisir entre longue durée et saisonnier. La longue durée offre une visibilité et une gestion légère ; le saisonnier maximise le rendement mais exige une structure d'exploitation.\n\nDans les deux cas, l'ameublement, la qualité de la photographie et la réactivité commerciale font la différence. Nos équipes assurent la mise en location, la sélection des locataires et le suivi technique." },
  { titleFr: "Pourquoi les riads continuent-ils de séduire ?", titleEn: "Why do riads keep seducing buyers?", cat: "Patrimoine", img: px(38891222), excerptFr: "Le riad reste le produit le plus émotionnel du marché. Analyse d'un attachement durable.", contentFr: "Acheter un riad, c'est acquérir un fragment de patrimoine. Patios, zelliges, tadelakt, terrasses ouvertes sur les minarets : rien n'est reproductible ailleurs.\n\nLes acquéreurs actuels recherchent des biens déjà restaurés, avec climatisation, piscine et accès véhicule à proximité. Les rénovations lourdes se négocient désormais avec une décote significative." },
  { titleFr: "Estimer son bien à Marrakech : la méthode", titleEn: "Valuing your property in Marrakech: the method", cat: "Vendre", img: px(12715491), excerptFr: "Comparables, état, emplacement, liquidité : les quatre piliers d'une estimation crédible.", contentFr: "Une estimation sérieuse ne se limite pas à un prix au mètre carré. Elle croise les transactions comparables des douze derniers mois, l'état réel du bien, la qualité de l'emplacement micro-local et la liquidité du segment.\n\nNos estimations sont réalisées sur place, documentées et accompagnées d'une stratégie de commercialisation." },
];

const quotes = [
  { quoteFr: "Une équipe exceptionnelle qui nous a accompagnés de la première visite jusqu'à la signature.", quoteEn: "An exceptional team that guided us from the very first viewing to signature.", author: "Claire & Antoine D.", detail: "Acquisition • Palmeraie" },
  { quoteFr: "Un niveau de service que nous n'avions jamais rencontré au Maroc. Discret, précis, efficace.", quoteEn: "A level of service we had never experienced in Morocco. Discreet, precise, efficient.", author: "Mehdi A.", detail: "Vente • Amelkis" },
  { quoteFr: "Notre riad a été loué en trois semaines, à un loyer supérieur à nos attentes.", quoteEn: "Our riad was rented within three weeks, above our expected rent.", author: "Sarah L.", detail: "Location • Médina" },
];

async function main() {
  console.log("Seeding...");
  await db.delete(propertyImages);
  await db.delete(propertyFeatures);
  await db.delete(properties);
  await db.delete(neighborhoods);
  await db.delete(agents);
  await db.delete(articles);
  await db.delete(testimonials);
  await db.delete(agencySettings);

  const hoodRows = await db
    .insert(neighborhoods)
    .values(
      hoodData.map((h, i) => ({
        name: h.name,
        slug: slugify(h.name),
        descriptorFr: h.descriptor,
        descriptorEn: h.descriptor,
        descriptionFr: h.desc,
        descriptionEn: h.desc,
        coverImage: h.img,
        latitude: h.lat,
        longitude: h.lng,
        published: true,
        sortOrder: i,
      })),
    )
    .returning();

  const agentRows = await db
    .insert(agents)
    .values(
      agentData.map((a) => ({
        name: a.name,
        slug: slugify(a.name),
        photoUrl: a.photo,
        jobTitle: a.jobTitle,
        phone: a.phone,
        whatsapp: a.whatsapp,
        email: a.email,
        bioFr: a.bioFr,
        bioEn: a.bioEn,
        languages: a.languages,
        active: true,
      })),
    )
    .returning();

  let counter = 1;
  for (const p of propertyData) {
    const hood = hoodRows.find((h) => h.name === p.hood);
    const agent = agentRows[counter % agentRows.length];
    const reference = `MK-${String(1000 + counter)}`;
    const jitter = () => (Math.random() - 0.5) * 0.012;
    const [created] = await db
      .insert(properties)
      .values({
        reference,
        slug: `${slugify(p.title)}-${slugify(reference)}`,
        transactionType: p.transaction,
        propertyType: p.type,
        titleFr: p.title,
        titleEn: p.titleEn,
        descriptionFr: p.desc,
        descriptionEn: p.descEn,
        price: String(p.price),
        currency: "MAD",
        priceType: "fixed",
        rentalFrequency: p.transaction === "rent" ? "month" : null,
        city: "Marrakech",
        neighborhoodId: hood?.id ?? null,
        address: `${p.hood}, Marrakech`,
        latitude: (hood?.latitude ?? 31.6295) + jitter(),
        longitude: (hood?.longitude ?? -7.9811) + jitter(),
        locationVisibility: "exact",
        livingArea: p.living || null,
        landArea: p.land ?? null,
        bedrooms: p.bedrooms || null,
        bathrooms: p.bathrooms || null,
        livingRooms: p.bedrooms ? 2 : null,
        garages: p.type === "villa" ? 2 : null,
        yearBuilt: p.year ?? null,
        agentId: agent.id,
        status: "published",
        isFeatured: Boolean(p.featured),
        isExclusive: Boolean(p.exclusive),
        isNew: counter <= 5,
        isHotOffer: counter % 6 === 0,
        publishedAt: new Date(),
      })
      .returning();

    await db.insert(propertyImages).values(
      p.imgs.map((id, index) => ({
        propertyId: created.id,
        imageUrl: px(id, 1800),
        altText: p.title,
        sortOrder: index,
        isCover: index === 0,
      })),
    );
    await db.insert(propertyFeatures).values(p.features.map((f) => ({ propertyId: created.id, feature: f })));
    counter += 1;
  }

  await db.insert(articles).values(
    articleData.map((a) => ({
      slug: slugify(a.titleFr),
      titleFr: a.titleFr,
      titleEn: a.titleEn,
      excerptFr: a.excerptFr,
      excerptEn: a.excerptFr,
      contentFr: a.contentFr,
      contentEn: a.contentFr,
      coverImage: a.img,
      category: a.cat,
      status: "published",
      publishedAt: new Date(),
    })),
  );

  await db.insert(testimonials).values(
    quotes.map((q, i) => ({
      quoteFr: q.quoteFr,
      quoteEn: q.quoteEn,
      authorName: q.author,
      detail: q.detail,
      sortOrder: i,
      published: true,
    })),
  );

  await db.insert(agencySettings).values({
    agencyName: "Louka & Vendy Real Estate",
    logo: "/brand/louka-vendy-gold.png",
    logoDark: "/brand/louka-vendy-gold.png",
    phone: "+212 524 00 00 00",
    whatsapp: "+212661123456",
    email: "contact@agency.ma",
    address: "Avenue Mohammed VI, Hivernage, Marrakech",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    defaultCurrency: "MAD",
    seoTitle: "Immobilier d'exception à Marrakech",
    seoDescription: "Villas, riads, appartements et terrains d'exception à Marrakech.",
    yearsExperience: 12,
    propertiesSold: 450,
    activeProperties: 250,
    clientCount: 20,
  });

  const existingAdmins = await db.select().from(adminUsers);
  if (existingAdmins.length === 0) {
    await db.insert(adminUsers).values({
      email: "admin@agency.ma",
      passwordHash: hashPassword("marrakech2026"),
      name: "Admin",
    });
  }

  console.log("Seed complete.");
  await pool.end();
}

main().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
