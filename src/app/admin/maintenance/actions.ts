"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { siteMaintenance } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { DEFAULT_MAINTENANCE_DESCRIPTION } from "@/lib/maintenance";

export type MaintenanceState = { error?: string; success?: string };

export async function saveMaintenance(_state: MaintenanceState, formData: FormData): Promise<MaintenanceState> {
  await requireSession();
  const enabled = formData.get("enabled");
  if (enabled !== "true" && enabled !== "false") return { error: "État de maintenance invalide." };
  const description = String(formData.get("description") ?? "").trim();
  if (description.length > 2000) return { error: "La description ne doit pas dépasser 2 000 caractères." };
  try {
    const values = { enabled: enabled === "true", description: description || DEFAULT_MAINTENANCE_DESCRIPTION, updatedAt: new Date() };
    await db.insert(siteMaintenance).values({ id: 1, ...values }).onConflictDoUpdate({ target: siteMaintenance.id, set: values });
    revalidatePath("/", "layout");
    return { success: values.enabled ? "Maintenance activée. Les visiteurs voient la page Coming soon." : "Maintenance désactivée. Le site est accessible aux visiteurs." };
  } catch {
    return { error: "Impossible d’enregistrer. Vérifiez la connexion à la base de données puis réessayez." };
  }
}
