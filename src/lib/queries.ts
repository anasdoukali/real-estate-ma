import { and, asc, count, desc, eq, gte, inArray, lte, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  agencySettings,
  agents,
  articles,
  neighborhoods,
  properties,
  propertyFeatures,
  propertyImages,
  testimonials,
  type Agent,
  type AgencySettings,
  type Neighborhood,
  type Property,
} from "@/db/schema";

export type PropertyWithRelations = Property & {
  images: { id: number; imageUrl: string; altText: string | null; isCover: boolean; sortOrder: number }[];
  features: string[];
  neighborhood: Neighborhood | null;
  agent: Agent | null;
  coverImage: string | null;
};

export type PropertyFilters = {
  transaction?: string;
  type?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minSurface?: number;
  maxSurface?: number;
  reference?: string;
  features?: string[];
  featured?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
  status?: string;
  excludeId?: number;
};

function buildConditions(f: PropertyFilters): SQL[] {
  const conds: SQL[] = [];
  const status = f.status ?? "public";
  if (status === "public") {
    conds.push(inArray(properties.status, ["published", "sold", "rented"]));
  } else if (status !== "any") {
    conds.push(eq(properties.status, status));
  }
  if (f.transaction && f.transaction !== "all") conds.push(eq(properties.transactionType, f.transaction));
  if (f.type && f.type !== "all") conds.push(eq(properties.propertyType, f.type));
  if (f.neighborhood && f.neighborhood !== "all") {
    conds.push(
      sql`${properties.neighborhoodId} IN (SELECT id FROM ${neighborhoods} WHERE slug = ${f.neighborhood})`,
    );
  }
  if (f.minPrice) conds.push(gte(properties.price, String(f.minPrice)));
  if (f.maxPrice) conds.push(lte(properties.price, String(f.maxPrice)));
  if (f.bedrooms) conds.push(gte(properties.bedrooms, f.bedrooms));
  if (f.bathrooms) conds.push(gte(properties.bathrooms, f.bathrooms));
  if (f.minSurface) conds.push(gte(properties.livingArea, f.minSurface));
  if (f.maxSurface) conds.push(lte(properties.livingArea, f.maxSurface));
  if (f.reference) {
    const ref = `%${f.reference.trim()}%`;
    const like = or(
      sql`${properties.reference} ILIKE ${ref}`,
      sql`${properties.titleFr} ILIKE ${ref}`,
      sql`${properties.titleEn} ILIKE ${ref}`,
    );
    if (like) conds.push(like);
  }
  if (f.featured) conds.push(eq(properties.isFeatured, true));
  if (f.excludeId) conds.push(ne(properties.id, f.excludeId));
  if (f.features && f.features.length) {
    for (const feat of f.features) {
      conds.push(
        sql`EXISTS (SELECT 1 FROM ${propertyFeatures} pf WHERE pf.property_id = ${properties.id} AND pf.feature = ${feat})`,
      );
    }
  }
  return conds;
}

function orderBy(sort?: string) {
  switch (sort) {
    case "price_asc":
      return asc(properties.price);
    case "price_desc":
      return desc(properties.price);
    case "surface":
      return desc(properties.livingArea);
    default:
      return desc(properties.createdAt);
  }
}

export async function countProperties(f: PropertyFilters = {}) {
  const conds = buildConditions(f);
  const rows = await db
    .select({ value: count() })
    .from(properties)
    .where(conds.length ? and(...conds) : undefined);
  return rows[0]?.value ?? 0;
}

export async function listProperties(f: PropertyFilters = {}): Promise<PropertyWithRelations[]> {
  const conds = buildConditions(f);
  const rows = await db
    .select({
      property: properties,
      neighborhood: neighborhoods,
      agent: agents,
    })
    .from(properties)
    .leftJoin(neighborhoods, eq(properties.neighborhoodId, neighborhoods.id))
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(orderBy(f.sort))
    .limit(f.limit ?? 24)
    .offset(f.offset ?? 0);

  if (!rows.length) return [];
  const ids = rows.map((r) => r.property.id);
  const imgs = await db
    .select()
    .from(propertyImages)
    .where(inArray(propertyImages.propertyId, ids))
    .orderBy(asc(propertyImages.sortOrder));
  const feats = await db.select().from(propertyFeatures).where(inArray(propertyFeatures.propertyId, ids));

  return rows.map((r) => {
    const images = imgs
      .filter((i) => i.propertyId === r.property.id)
      .map((i) => ({
        id: i.id,
        imageUrl: i.imageUrl,
        altText: i.altText,
        isCover: i.isCover,
        sortOrder: i.sortOrder,
      }));
    const cover = images.find((i) => i.isCover) ?? images[0];
    return {
      ...r.property,
      images,
      features: feats.filter((x) => x.propertyId === r.property.id).map((x) => x.feature),
      neighborhood: r.neighborhood,
      agent: r.agent,
      coverImage: cover?.imageUrl ?? null,
    };
  });
}

export async function getPropertyBySlug(slug: string): Promise<PropertyWithRelations | null> {
  const rows = await db
    .select({ property: properties, neighborhood: neighborhoods, agent: agents })
    .from(properties)
    .leftJoin(neighborhoods, eq(properties.neighborhoodId, neighborhoods.id))
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .where(eq(properties.slug, slug))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  const images = await db
    .select()
    .from(propertyImages)
    .where(eq(propertyImages.propertyId, row.property.id))
    .orderBy(asc(propertyImages.sortOrder));
  const feats = await db
    .select()
    .from(propertyFeatures)
    .where(eq(propertyFeatures.propertyId, row.property.id));
  const mapped = images.map((i) => ({
    id: i.id,
    imageUrl: i.imageUrl,
    altText: i.altText,
    isCover: i.isCover,
    sortOrder: i.sortOrder,
  }));
  return {
    ...row.property,
    images: mapped,
    features: feats.map((f) => f.feature),
    neighborhood: row.neighborhood,
    agent: row.agent,
    coverImage: (mapped.find((i) => i.isCover) ?? mapped[0])?.imageUrl ?? null,
  };
}

export const DEFAULT_AGENCY_SETTINGS: AgencySettings = {
  id: 0,
  agencyName: "Louka & Vendy Real Estate",
  logo: "/brand/louka-vendy-gold.png",
  logoDark: "/brand/louka-vendy-gold.png",
  phone: "+212 5 24 00 00 00",
  whatsapp: "+212600000000",
  email: "contact@agency.ma",
  address: "Marrakech, Maroc",
  instagram: null,
  facebook: null,
  linkedin: null,
  defaultCurrency: "MAD",
  seoTitle: null,
  seoDescription: null,
  yearsExperience: 12,
  propertiesSold: 450,
  activeProperties: 250,
  clientCount: 20,
};

export async function getSettings() {
  const rows = await db.select().from(agencySettings).limit(1);
  const settings = rows[0];
  if (!settings) return DEFAULT_AGENCY_SETTINGS;
  return {
    ...settings,
    agencyName:
      !settings.agencyName || settings.agencyName === "[AGENCY NAME]" || settings.agencyName.toUpperCase() === "MAPYGO REAL ESTATE"
        ? DEFAULT_AGENCY_SETTINGS.agencyName
        : settings.agencyName,
    logo: settings.logo || DEFAULT_AGENCY_SETTINGS.logo,
    logoDark: settings.logoDark || DEFAULT_AGENCY_SETTINGS.logoDark,
  };
}

export async function listNeighborhoods(onlyPublished = true) {
  const fallbackImages: Record<string, string> = {
    palmeraie: "https://images.pexels.com/photos/9730025/pexels-photo-9730025.jpeg?auto=compress&cs=tinysrgb&w=1600",
    hivernage: "https://images.pexels.com/photos/8484851/pexels-photo-8484851.jpeg?auto=compress&cs=tinysrgb&w=1600",
    gueliz: "https://images.pexels.com/photos/7005300/pexels-photo-7005300.jpeg?auto=compress&cs=tinysrgb&w=1600",
    amelkis: "https://images.pexels.com/photos/12715491/pexels-photo-12715491.jpeg?auto=compress&cs=tinysrgb&w=1600",
    agdal: "https://images.pexels.com/photos/36710315/pexels-photo-36710315.jpeg?auto=compress&cs=tinysrgb&w=1600",
    medina: "https://images.pexels.com/photos/38891222/pexels-photo-38891222.jpeg?auto=compress&cs=tinysrgb&w=1600",
    targa: "https://images.pexels.com/photos/6283965/pexels-photo-6283965.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "route-de-l-ourika": "https://images.pexels.com/photos/12715498/pexels-photo-12715498.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "route-de-fes": "https://images.pexels.com/photos/15360707/pexels-photo-15360707.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "route-de-casablanca": "https://images.pexels.com/photos/35156066/pexels-photo-35156066.jpeg?auto=compress&cs=tinysrgb&w=1600",
    izdihar: "https://images.pexels.com/photos/38785630/pexels-photo-38785630.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mabrouka: "https://images.pexels.com/photos/2610815/pexels-photo-2610815.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "jamaa-el-fena": "https://images.pexels.com/photos/10573397/pexels-photo-10573397.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mhamid: "https://images.pexels.com/photos/35156066/pexels-photo-35156066.jpeg?auto=compress&cs=tinysrgb&w=1600",
  };
  const rows = await db
    .select({
      n: neighborhoods,
      propertyCount: sql<number>`(SELECT COUNT(*) FROM ${properties} p WHERE p.neighborhood_id = ${neighborhoods.id} AND p.status IN ('published','sold','rented'))`,
    })
    .from(neighborhoods)
    .where(onlyPublished ? eq(neighborhoods.published, true) : undefined)
    .orderBy(asc(neighborhoods.sortOrder), asc(neighborhoods.name));
  return rows.map((r) => ({
    ...r.n,
    coverImage: r.n.coverImage || fallbackImages[r.n.slug] || null,
    propertyCount: Number(r.propertyCount),
  }));
}

export async function getNeighborhoodBySlug(slug: string) {
  const rows = await db.select().from(neighborhoods).where(eq(neighborhoods.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function listAgents(onlyActive = true) {
  return db
    .select()
    .from(agents)
    .where(onlyActive ? eq(agents.active, true) : undefined)
    .orderBy(asc(agents.id));
}

export async function getAgentBySlug(slug: string) {
  const rows = await db.select().from(agents).where(eq(agents.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function listArticles(onlyPublished = true, limit = 12) {
  return db
    .select()
    .from(articles)
    .where(onlyPublished ? eq(articles.status, "published") : undefined)
    .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
    .limit(limit);
}

export async function getArticleBySlug(slug: string) {
  const rows = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function listTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(asc(testimonials.sortOrder));
}

export async function typeCounts() {
  const rows = await db
    .select({ type: properties.propertyType, value: count() })
    .from(properties)
    .where(inArray(properties.status, ["published", "sold", "rented"]))
    .groupBy(properties.propertyType);
  const map: Record<string, number> = {};
  for (const r of rows) map[r.type] = Number(r.value);
  return map;
}
