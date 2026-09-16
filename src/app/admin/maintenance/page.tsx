import MaintenanceForm from "@/components/admin/MaintenanceForm";
import { requireSession } from "@/lib/auth";
import { getMaintenance } from "@/lib/maintenance";

export const dynamic = "force-dynamic";
export default async function MaintenancePage() {
  await requireSession();
  const settings = await getMaintenance();
  return <div><h1 className="text-[22px] font-semibold tracking-tight">Maintenance du site</h1><p className="mt-2 text-sm text-muted">Préparez vos modifications tout en présentant votre agence aux visiteurs.</p><MaintenanceForm enabled={settings.enabled} description={settings.description}/></div>;
}
