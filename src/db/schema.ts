import type { NeighborhoodProfile } from "@/lib/neighborhood-profile";
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull().default("Admin"),
  role: varchar("role", { length: 40 }).notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const neighborhoods = pgTable("neighborhoods", {
  profile: jsonb("profile").$type<NeighborhoodProfile>(),
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  descriptorFr: varchar("descriptor_fr", { length: 240 }),
  descriptorEn: varchar("descriptor_en", { length: 240 }),
  coverImage: text("cover_image"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  photoUrl: text("photo_url"),
  jobTitle: varchar("job_title", { length: 160 }),
  phone: varchar("phone", { length: 60 }),
  whatsapp: varchar("whatsapp", { length: 60 }),
  email: varchar("email", { length: 190 }),
  bioFr: text("bio_fr"),
  bioEn: text("bio_en"),
  languages: text("languages"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 40 }).notNull().unique(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  transactionType: varchar("transaction_type", { length: 20 }).notNull().default("sale"),
  propertyType: varchar("property_type", { length: 40 }).notNull().default("villa"),
  titleFr: varchar("title_fr", { length: 240 }).notNull(),
  titleEn: varchar("title_en", { length: 240 }),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  price: numeric("price", { precision: 14, scale: 2 }).notNull().default("0"),
  currency: varchar("currency", { length: 8 }).notNull().default("MAD"),
  priceType: varchar("price_type", { length: 20 }).notNull().default("fixed"),
  rentalFrequency: varchar("rental_frequency", { length: 20 }),
  city: varchar("city", { length: 120 }).notNull().default("Marrakech"),
  neighborhoodId: integer("neighborhood_id"),
  address: varchar("address", { length: 240 }),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  locationVisibility: varchar("location_visibility", { length: 20 }).notNull().default("exact"),
  livingArea: integer("living_area"),
  landArea: integer("land_area"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  livingRooms: integer("living_rooms"),
  garages: integer("garages"),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  yearBuilt: integer("year_built"),
  videoUrl: text("video_url"),
  agentId: integer("agent_id"),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isExclusive: boolean("is_exclusive").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  isHotOffer: boolean("is_hot_offer").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  imageUrl: text("image_url").notNull(),
  storagePath: text("storage_path"),
  altText: varchar("alt_text", { length: 240 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isCover: boolean("is_cover").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const propertyFeatures = pgTable("property_features", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  feature: varchar("feature", { length: 80 }).notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id"),
  agentId: integer("agent_id"),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 60 }),
  email: varchar("email", { length: 190 }),
  intent: varchar("intent", { length: 40 }),
  message: text("message"),
  source: varchar("source", { length: 40 }).notNull().default("contact"),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const valuationRequests = pgTable("valuation_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 60 }),
  email: varchar("email", { length: 190 }),
  propertyType: varchar("property_type", { length: 40 }),
  neighborhood: varchar("neighborhood", { length: 160 }),
  address: varchar("address", { length: 240 }),
  livingArea: integer("living_area"),
  landArea: integer("land_area"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  condition: varchar("condition", { length: 60 }),
  message: text("message"),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  titleFr: varchar("title_fr", { length: 240 }).notNull(),
  titleEn: varchar("title_en", { length: 240 }),
  excerptFr: text("excerpt_fr"),
  excerptEn: text("excerpt_en"),
  contentFr: text("content_fr"),
  contentEn: text("content_en"),
  coverImage: text("cover_image"),
  category: varchar("category", { length: 80 }),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  language: varchar("language", { length: 8 }).notNull().default("fr"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quoteFr: text("quote_fr").notNull(),
  quoteEn: text("quote_en"),
  authorName: varchar("author_name", { length: 160 }).notNull(),
  detail: varchar("detail", { length: 160 }),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const agencySettings = pgTable("agency_settings", {
  id: serial("id").primaryKey(),
  agencyName: varchar("agency_name", { length: 160 }).notNull().default("Louka & Vendy Real Estate"),
  logo: text("logo"),
  logoDark: text("logo_dark"),
  phone: varchar("phone", { length: 60 }),
  whatsapp: varchar("whatsapp", { length: 60 }),
  email: varchar("email", { length: 190 }),
  address: varchar("address", { length: 240 }),
  instagram: text("instagram"),
  facebook: text("facebook"),
  linkedin: text("linkedin"),
  defaultCurrency: varchar("default_currency", { length: 8 }).notNull().default("MAD"),
  seoTitle: varchar("seo_title", { length: 240 }),
  seoDescription: text("seo_description"),
  yearsExperience: integer("years_experience").notNull().default(12),
  propertiesSold: integer("properties_sold").notNull().default(450),
  activeProperties: integer("active_properties").notNull().default(250),
  clientCount: integer("client_count").notNull().default(20),
});

export type Property = typeof properties.$inferSelect;
// Singleton row (id = 1), kept separate from agency contact settings.
export const siteMaintenance = pgTable("site_maintenance", {
  id: integer("id").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  description: text("description").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PropertyImage = typeof propertyImages.$inferSelect;
export type Neighborhood = typeof neighborhoods.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type ValuationRequest = typeof valuationRequests.$inferSelect;
export type AgencySettings = typeof agencySettings.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
