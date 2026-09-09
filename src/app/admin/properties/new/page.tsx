import PropertyForm from "@/components/admin/PropertyForm";
import { listAgents, listNeighborhoods } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  const [hoods, team] = await Promise.all([listNeighborhoods(false), listAgents(false)]);
  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight">Ajouter un bien</h1>
      <div className="mt-6">
        <PropertyForm
          neighborhoods={hoods.map((n) => ({ id: n.id, name: n.name }))}
          agents={team.map((a) => ({ id: a.id, name: a.name }))}
        />
      </div>
    </div>
  );
}
