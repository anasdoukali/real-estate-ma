import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteMaintenance } from "@/db/schema";

export const DEFAULT_MAINTENANCE_DESCRIPTION = "Louka & Vendy Real Estate vous accompagne dans l’achat, la vente et la location de propriétés d’exception à Marrakech. Villas, riads et appartements : notre équipe allie connaissance du marché local et accompagnement personnalisé pour donner vie à votre projet immobilier.";

export async function getMaintenance(): Promise<{ enabled: boolean; description: string }> {
  const [row] = await db.select().from(siteMaintenance).where(eq(siteMaintenance.id, 1));
  return row ?? { enabled: false, description: DEFAULT_MAINTENANCE_DESCRIPTION };
}
