import NeighborhoodProfileFields from "@/components/admin/NeighborhoodProfileFields";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { neighborhoods } from "@/db/schema";
import { deleteNeighborhoodAction, saveNeighborhoodAction } from "../actions";

export const dynamic = "force-dynamic";

const input = "h-10 w-full rounded-md border border-[#d4d4d8] px-3 text-[13.5px] outline-none focus:border-black";

export default async function AdminNeighborhoodsPage() {
  const rows = await db.select().from(neighborhoods).orderBy(asc(neighborhoods.sortOrder), asc(neighborhoods.name));

  return (
    <div className="space-y-8">
      <h1 className="text-[22px] font-semibold tracking-tight">Quartiers</h1>

      <section className="rounded-lg border border-[#e4e4e7] bg-white p-6">
        <h2 className="text-[14px] font-semibold">Nouveau quartier</h2>
        <form action={saveNeighborhoodAction} className="mt-5 grid gap-4 md:grid-cols-3">
          <input className={input} name="name" placeholder="Nom" required />
          <input className={input} name="coverImage" placeholder="URL image" />
          <input className={input} name="descriptorFr" placeholder="Descripteur FR" />
          <input className={input} name="descriptorEn" placeholder="Descriptor EN" />
          <input className={input} name="latitude" placeholder="Latitude" />
          <input className={input} name="longitude" placeholder="Longitude" />
          <textarea className="md:col-span-3 min-h-[90px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="descriptionFr" placeholder="Description FR" />
          <textarea className="md:col-span-3 min-h-[90px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="descriptionEn" placeholder="Description EN" />
          <NeighborhoodProfileFields />
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" name="published" defaultChecked /> Publié
          </label>
          <button className="rounded-md bg-black px-5 py-2.5 text-[13px] text-white">Ajouter</button>
        </form>
      </section>

      <div className="space-y-4">
        {rows.map((n) => (
          // Remount after profile changes so React's post-submit reset uses the
          // saved select defaults instead of the previous "Non renseigné" values.
          <form key={`${n.id}:${JSON.stringify(n.profile)}`} action={saveNeighborhoodAction} className="grid gap-4 rounded-lg border border-[#e4e4e7] bg-white p-6 md:grid-cols-3">
            <input type="hidden" name="id" value={n.id} />
            <input type="hidden" name="slug" value={n.slug} />
            <input className={input} name="name" defaultValue={n.name} />
            <input className={input} name="coverImage" defaultValue={n.coverImage ?? ""} />
            <input className={input} name="descriptorFr" defaultValue={n.descriptorFr ?? ""} />
            <input className={input} name="descriptorEn" defaultValue={n.descriptorEn ?? ""} />
            <input className={input} name="latitude" defaultValue={n.latitude ?? ""} />
            <input className={input} name="longitude" defaultValue={n.longitude ?? ""} />
            <textarea className="md:col-span-3 min-h-[90px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="descriptionFr" defaultValue={n.descriptionFr ?? ""} />
            <textarea className="md:col-span-3 min-h-[90px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="descriptionEn" defaultValue={n.descriptionEn ?? ""} />
            <NeighborhoodProfileFields profile={n.profile} />
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" name="published" defaultChecked={n.published} /> Publié
            </label>
            <div className="flex gap-3">
              <button className="rounded-md bg-black px-5 py-2.5 text-[13px] text-white">Enregistrer</button>
              <button formAction={deleteNeighborhoodAction.bind(null, n.id)} className="rounded-md border border-red-200 px-5 py-2.5 text-[13px] text-red-600">
                Supprimer
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
