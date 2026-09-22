"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  adminUsers,
  agencySettings,
  agents,
  articles,
  leads,
  neighborhoods,
  properties,
  propertyFeatures,
  propertyImages,
  valuationRequests,
} from "@/db/schema";
import { createSession, destroySession, hashPassword, requireSession, verifyPassword } from "@/lib/auth";
import { parseNeighborhoodProfile } from "@/lib/neighborhood-profile";
import { slugify } from "@/lib/site";

export type ActionState = { error?: string; ok?: boolean };

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email et mot de passe requis." };

  const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  let user = rows[0];

  if (!user) {
    const total = await db.select().from(adminUsers);
    if (total.length === 0) {
      const [created] = await db
        .insert(adminUsers)
        .values({ email, passwordHash: hashPassword(password), name: "Admin" })
        .returning();
      user = created;
    } else {
      return { error: "Identifiants invalides." };
    }
  } else if (!verifyPassword(password, user.passwordHash)) {
    return { error: "Identifiants invalides." };
  }

  await createSession({ sub: String(user.id), email: user.email, name: user.name });
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export type PropertyPayload = {
  id?: number;
  reference: string;
  slug?: string;
  transactionType: string;
  propertyType: string;
  titleFr: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  price: string;
  currency: string;
  priceType: string;
  rentalFrequency?: string;
  city: string;
  neighborhoodId?: number | null;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  locationVisibility: string;
  livingArea?: number | null;
  landArea?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  livingRooms?: number | null;
  garages?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  yearBuilt?: number | null;
  videoUrl?: string;
  agentId?: number | null;
  status: string;
  isFeatured: boolean;
  isExclusive: boolean;
  isNew: boolean;
  isHotOffer: boolean;
  features: string[];
  images: { imageUrl: string; isCover: boolean; altText?: string }[];
};

export async function savePropertyAction(payload: PropertyPayload) {
  await requireSession();
  const base = {
    reference: payload.reference || `MK-${Date.now().toString().slice(-6)}`,
    transactionType: payload.transactionType,
    propertyType: payload.propertyType,
    titleFr: payload.titleFr,
    titleEn: payload.titleEn ?? null,
    descriptionFr: payload.descriptionFr ?? null,
    descriptionEn: payload.descriptionEn ?? null,
    price: payload.price || "0",
    currency: payload.currency,
    priceType: payload.priceType,
    rentalFrequency: payload.rentalFrequency ?? null,
    city: payload.city || "Marrakech",
    neighborhoodId: payload.neighborhoodId ?? null,
    address: payload.address ?? null,
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    locationVisibility: payload.locationVisibility,
    livingArea: payload.livingArea ?? null,
    landArea: payload.landArea ?? null,
    bedrooms: payload.bedrooms ?? null,
    bathrooms: payload.bathrooms ?? null,
    livingRooms: payload.livingRooms ?? null,
    garages: payload.garages ?? null,
    floor: payload.floor ?? null,
    totalFloors: payload.totalFloors ?? null,
    yearBuilt: payload.yearBuilt ?? null,
    videoUrl: payload.videoUrl ?? null,
    agentId: payload.agentId ?? null,
    status: payload.status,
    isFeatured: payload.isFeatured,
    isExclusive: payload.isExclusive,
    isNew: payload.isNew,
    isHotOffer: payload.isHotOffer,
    updatedAt: new Date(),
    publishedAt: payload.status === "published" ? new Date() : null,
  };

  let id = payload.id;
  const slugBase = payload.slug?.trim() || `${slugify(payload.titleFr)}-${slugify(base.reference)}`;

  if (id) {
    await db.update(properties).set({ ...base, slug: slugBase }).where(eq(properties.id, id));
  } else {
    const [created] = await db
      .insert(properties)
      .values({ ...base, slug: slugBase })
      .returning({ id: properties.id });
    id = created.id;
  }

  await db.delete(propertyFeatures).where(eq(propertyFeatures.propertyId, id));
  if (payload.features.length) {
    await db.insert(propertyFeatures).values(payload.features.map((f) => ({ propertyId: id as number, feature: f })));
  }

  await db.delete(propertyImages).where(eq(propertyImages.propertyId, id));
  if (payload.images.length) {
    const hasCover = payload.images.some((i) => i.isCover);
    await db.insert(propertyImages).values(
      payload.images.map((img, index) => ({
        propertyId: id as number,
        imageUrl: img.imageUrl,
        altText: img.altText ?? payload.titleFr,
        sortOrder: index,
        isCover: hasCover ? img.isCover : index === 0,
      })),
    );
  }

  revalidatePath("/");
  revalidatePath("/biens");
  revalidatePath("/admin/properties");
  return { ok: true, id };
}

export async function setPropertyStatusAction(id: number, status: string) {
  await requireSession();
  await db
    .update(properties)
    .set({ status, updatedAt: new Date(), publishedAt: status === "published" ? new Date() : undefined })
    .where(eq(properties.id, id));
  revalidatePath("/admin/properties");
  revalidatePath("/");
}

export async function deletePropertyAction(id: number) {
  await requireSession();
  await db.delete(propertyImages).where(eq(propertyImages.propertyId, id));
  await db.delete(propertyFeatures).where(eq(propertyFeatures.propertyId, id));
  await db.delete(properties).where(eq(properties.id, id));
  revalidatePath("/admin/properties");
  revalidatePath("/");
}

export async function duplicatePropertyAction(id: number) {
  await requireSession();
  const [row] = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  if (!row) return;
  const imgs = await db.select().from(propertyImages).where(eq(propertyImages.propertyId, id));
  const feats = await db.select().from(propertyFeatures).where(eq(propertyFeatures.propertyId, id));
  const reference = `${row.reference}-COPY-${Date.now().toString().slice(-4)}`;
  const [created] = await db
    .insert(properties)
    .values({
      ...row,
      id: undefined as unknown as number,
      reference,
      slug: `${row.slug}-copie-${Date.now().toString().slice(-4)}`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: properties.id });
  if (imgs.length) {
    await db.insert(propertyImages).values(
      imgs.map((i) => ({
        propertyId: created.id,
        imageUrl: i.imageUrl,
        altText: i.altText,
        sortOrder: i.sortOrder,
        isCover: i.isCover,
      })),
    );
  }
  if (feats.length) {
    await db.insert(propertyFeatures).values(feats.map((f) => ({ propertyId: created.id, feature: f.feature })));
  }
  revalidatePath("/admin/properties");
}

export async function saveAgentAction(formData: FormData) {
  await requireSession();
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const values = {
    name,
    slug: String(formData.get("slug") ?? "").trim() || slugify(name),
    photoUrl: (String(formData.get("photoUrl") ?? "") || null) as string | null,
    jobTitle: String(formData.get("jobTitle") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    whatsapp: String(formData.get("whatsapp") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    bioFr: String(formData.get("bioFr") ?? "") || null,
    bioEn: String(formData.get("bioEn") ?? "") || null,
    languages: String(formData.get("languages") ?? "") || null,
    active: formData.get("active") === "on",
  };
  if (id) await db.update(agents).set(values).where(eq(agents.id, id));
  else await db.insert(agents).values(values);
  revalidatePath("/admin/agents");
  revalidatePath("/agence");
}

export async function deleteAgentAction(id: number) {
  await requireSession();
  await db.delete(agents).where(eq(agents.id, id));
  revalidatePath("/admin/agents");
}

export async function saveNeighborhoodAction(formData: FormData) {
  await requireSession();
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const num = (k: string) => {
    const v = Number(formData.get(k));
    return Number.isFinite(v) && v !== 0 ? v : null;
  };
  const values = {
    profile: parseNeighborhoodProfile(formData),
    name,
    slug: String(formData.get("slug") ?? "").trim() || slugify(name),
    descriptorFr: String(formData.get("descriptorFr") ?? "") || null,
    descriptorEn: String(formData.get("descriptorEn") ?? "") || null,
    descriptionFr: String(formData.get("descriptionFr") ?? "") || null,
    descriptionEn: String(formData.get("descriptionEn") ?? "") || null,
    coverImage: String(formData.get("coverImage") ?? "") || null,
    latitude: num("latitude"),
    longitude: num("longitude"),
    published: formData.get("published") === "on",
  };
  if (id) await db.update(neighborhoods).set(values).where(eq(neighborhoods.id, id));
  else await db.insert(neighborhoods).values(values);
  revalidatePath("/admin/neighborhoods");
  revalidatePath("/quartiers", "layout");
}

export async function deleteNeighborhoodAction(id: number) {
  await requireSession();
  await db.delete(neighborhoods).where(eq(neighborhoods.id, id));
  revalidatePath("/admin/neighborhoods");
}

export async function saveArticleAction(formData: FormData) {
  await requireSession();
  const id = Number(formData.get("id") ?? 0);
  const titleFr = String(formData.get("titleFr") ?? "").trim();
  if (!titleFr) return;
  const status = String(formData.get("status") ?? "draft");
  const values = {
    titleFr,
    titleEn: String(formData.get("titleEn") ?? "") || null,
    slug: String(formData.get("slug") ?? "").trim() || slugify(titleFr),
    excerptFr: String(formData.get("excerptFr") ?? "") || null,
    excerptEn: String(formData.get("excerptEn") ?? "") || null,
    contentFr: String(formData.get("contentFr") ?? "") || null,
    contentEn: String(formData.get("contentEn") ?? "") || null,
    coverImage: String(formData.get("coverImage") ?? "") || null,
    category: String(formData.get("category") ?? "") || null,
    status,
    publishedAt: status === "published" ? new Date() : null,
    updatedAt: new Date(),
  };
  if (id) await db.update(articles).set(values).where(eq(articles.id, id));
  else await db.insert(articles).values(values);
  revalidatePath("/admin/articles");
  revalidatePath("/blog");
}

export async function deleteArticleAction(id: number) {
  await requireSession();
  await db.delete(articles).where(eq(articles.id, id));
  revalidatePath("/admin/articles");
}

export async function updateLeadAction(formData: FormData) {
  await requireSession();
  const id = Number(formData.get("id"));
  if (!id) return;
  await db
    .update(leads)
    .set({
      status: String(formData.get("status") ?? "new"),
      notes: String(formData.get("notes") ?? "") || null,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id));
  revalidatePath("/admin/leads");
}

export async function deleteValuationAction(id: number): Promise<ActionState> {
  await requireSession();
  if (!Number.isSafeInteger(id) || id <= 0) return { error: "Demande invalide." };
  try {
    await db.delete(valuationRequests).where(eq(valuationRequests.id, id));
  } catch {
    return { error: "La suppression a échoué. Veuillez réessayer." };
  }
  revalidatePath("/admin/valuations");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateValuationAction(formData: FormData) {
  await requireSession();
  const id = Number(formData.get("id"));
  if (!id) return;
  await db
    .update(valuationRequests)
    .set({ status: String(formData.get("status") ?? "new"), updatedAt: new Date() })
    .where(eq(valuationRequests.id, id));
  revalidatePath("/admin/valuations");
}

export async function saveSettingsAction(formData: FormData) {
  await requireSession();
  const num = (k: string, fallback: number) => {
    const v = Number(formData.get(k));
    return Number.isFinite(v) ? v : fallback;
  };
  const values = {
    agencyName: String(formData.get("agencyName") ?? "Louka & Vendy Real Estate"),
    phone: String(formData.get("phone") ?? "") || null,
    whatsapp: String(formData.get("whatsapp") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    address: String(formData.get("address") ?? "") || null,
    instagram: String(formData.get("instagram") ?? "") || null,
    facebook: String(formData.get("facebook") ?? "") || null,
    linkedin: String(formData.get("linkedin") ?? "") || null,
    defaultCurrency: String(formData.get("defaultCurrency") ?? "MAD"),
    seoTitle: String(formData.get("seoTitle") ?? "") || null,
    seoDescription: String(formData.get("seoDescription") ?? "") || null,
    yearsExperience: num("yearsExperience", 12),
    propertiesSold: num("propertiesSold", 450),
    activeProperties: num("activeProperties", 250),
    clientCount: num("clientCount", 20),
  };
  const existing = await db.select({ id: agencySettings.id }).from(agencySettings).limit(1);
  if (existing[0]) await db.update(agencySettings).set(values).where(eq(agencySettings.id, existing[0].id));
  else await db.insert(agencySettings).values(values);
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function toggleSubscriberAction(id: number, active: boolean) {
  await requireSession();
  const { newsletterSubscribers } = await import("@/db/schema");
  await db.update(newsletterSubscribers).set({ active }).where(eq(newsletterSubscribers.id, id));
  revalidatePath("/admin/newsletter");
}
