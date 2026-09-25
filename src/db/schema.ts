import type { NeighborhoodProfile } from "@/lib/neighborhood-profile";
import {
  boolean,
  double,
  int,
  json,
  decimal,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull().default("Admin"),
  role: varchar("role", { length: 40 }).notNull().default("admin"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const neighborhoods = mysqlTable("neighborhoods", {
  id: int("id").autoincrement().primaryKey(),
  profile: json("profile").$type<NeighborhoodProfile>(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  descriptorFr: varchar("descriptor_fr", { length: 240 }),
  descriptorEn: varchar("descriptor_en", { length: 240 }),
  coverImage: text("cover_image"),
  latitude: double("latitude"),
  longitude: double("longitude"),
  published: boolean("published").notNull().default(true),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
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
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  reference: varchar("reference", { length: 40 }).notNull().unique(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  transactionType: varchar("transaction_type", { length: 20 }).notNull().default("sale"),
  propertyType: varchar("property_type", { length: 40 }).notNull().default("villa"),
  titleFr: varchar("title_fr", { length: 240 }).notNull(),
  titleEn: varchar("title_en", { length: 240 }),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  price: decimal("price", { precision: 14, scale: 2 }).notNull().default("0"),
  currency: varchar("currency", { length: 8 }).notNull().default("MAD"),
  priceType: varchar("price_type", { length: 20 }).notNull().default("fixed"),
  rentalFrequency: varchar("rental_frequency", { length: 20 }),
  city: varchar("city", { length: 120 }).notNull().default("Marrakech"),
  neighborhoodId: int("neighborhood_id"),
  address: varchar("address", { length: 240 }),
  latitude: double("latitude"),
  longitude: double("longitude"),
  locationVisibility: varchar("location_visibility", { length: 20 }).notNull().default("exact"),
  livingArea: int("living_area"),
  landArea: int("land_area"),
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  livingRooms: int("living_rooms"),
  garages: int("garages"),
  floor: int("floor"),
  totalFloors: int("total_floors"),
  yearBuilt: int("year_built"),
  videoUrl: text("video_url"),
  agentId: int("agent_id"),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isExclusive: boolean("is_exclusive").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  isHotOffer: boolean("is_hot_offer").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { mode: "date" }),
});

export const propertyImages = mysqlTable("property_images", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("property_id").notNull(),
  imageUrl: text("image_url").notNull(),
  storagePath: text("storage_path"),
  altText: varchar("alt_text", { length: 240 }),
  sortOrder: int("sort_order").notNull().default(0),
  isCover: boolean("is_cover").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const propertyFeatures = mysqlTable("property_features", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("property_id").notNull(),
  feature: varchar("feature", { length: 80 }).notNull(),
});

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("property_id"),
  agentId: int("agent_id"),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 60 }),
  email: varchar("email", { length: 190 }),
  intent: varchar("intent", { length: 40 }),
  message: text("message"),
  source: varchar("source", { length: 40 }).notNull().default("contact"),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const valuationRequests = mysqlTable("valuation_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 60 }),
  email: varchar("email", { length: 190 }),
  propertyType: varchar("property_type", { length: 40 }),
  neighborhood: varchar("neighborhood", { length: 160 }),
  address: varchar("address", { length: 240 }),
  livingArea: int("living_area"),
  landArea: int("land_area"),
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  condition: varchar("condition", { length: 60 }),
  message: text("message"),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
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
  publishedAt: timestamp("published_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  language: varchar("language", { length: 8 }).notNull().default("fr"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  quoteFr: text("quote_fr").notNull(),
  quoteEn: text("quote_en"),
  authorName: varchar("author_name", { length: 160 }).notNull(),
  detail: varchar("detail", { length: 160 }),
  sortOrder: int("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const agencySettings = mysqlTable("agency_settings", {
  id: int("id").autoincrement().primaryKey(),
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
  yearsExperience: int("years_experience").notNull().default(12),
  propertiesSold: int("properties_sold").notNull().default(450),
  activeProperties: int("active_properties").notNull().default(250),
  clientCount: int("client_count").notNull().default(20),
});

export type Property = typeof properties.$inferSelect;
// Singleton row (id = 1), kept separate from agency contact settings.
export const siteMaintenance = mysqlTable("site_maintenance", {
  id: int("id").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  description: text("description").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type PropertyImage = typeof propertyImages.$inferSelect;
export type Neighborhood = typeof neighborhoods.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type ValuationRequest = typeof valuationRequests.$inferSelect;
export type AgencySettings = typeof agencySettings.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
