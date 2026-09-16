import type { Metadata } from "next";
import MaintenanceScreen from "@/components/site/MaintenanceScreen";
import { getSettings, DEFAULT_AGENCY_SETTINGS } from "@/lib/queries";
import { loadPublicData } from "@/lib/public-data";
import { getMaintenance, DEFAULT_MAINTENANCE_DESCRIPTION } from "@/lib/maintenance";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Coming soon", robots: { index: false, follow: false } };

export default async function ComingSoonPage() {
  const [agency, maintenance] = await Promise.all([
    loadPublicData(getSettings, DEFAULT_AGENCY_SETTINGS),
    loadPublicData(getMaintenance, { enabled: true, description: DEFAULT_MAINTENANCE_DESCRIPTION }),
  ]);
  return <MaintenanceScreen agency={agency} description={maintenance.description} />;
}
