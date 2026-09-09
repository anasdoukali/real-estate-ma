import { asc } from "drizzle-orm";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { deleteAgentAction, saveAgentAction } from "../actions";

export const dynamic = "force-dynamic";

const input = "h-10 w-full rounded-md border border-[#d4d4d8] px-3 text-[13.5px] outline-none focus:border-black";

export default async function AdminAgentsPage() {
  const rows = await db.select().from(agents).orderBy(asc(agents.id));

  return (
    <div className="space-y-8">
      <h1 className="text-[22px] font-semibold tracking-tight">Agents</h1>

      <section className="rounded-lg border border-[#e4e4e7] bg-white p-6">
        <h2 className="text-[14px] font-semibold">Nouvel agent</h2>
        <form action={saveAgentAction} className="mt-5 grid gap-4 md:grid-cols-3">
          <input className={input} name="name" placeholder="Nom" required />
          <input className={input} name="jobTitle" placeholder="Fonction" />
          <input className={input} name="photoUrl" placeholder="URL de la photo" />
          <input className={input} name="phone" placeholder="Téléphone" />
          <input className={input} name="whatsapp" placeholder="WhatsApp" />
          <input className={input} name="email" placeholder="Email" />
          <input className={input} name="languages" placeholder="Langues (FR, EN, AR)" />
          <textarea className="md:col-span-3 min-h-[100px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="bioFr" placeholder="Biographie FR" />
          <textarea className="md:col-span-3 min-h-[100px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="bioEn" placeholder="Biography EN" />
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" name="active" defaultChecked /> Actif
          </label>
          <button className="rounded-md bg-black px-5 py-2.5 text-[13px] text-white">Ajouter</button>
        </form>
      </section>

      <div className="space-y-4">
        {rows.map((a) => (
          <form key={a.id} action={saveAgentAction} className="grid gap-4 rounded-lg border border-[#e4e4e7] bg-white p-6 md:grid-cols-3">
            <input type="hidden" name="id" value={a.id} />
            <input type="hidden" name="slug" value={a.slug} />
            <input className={input} name="name" defaultValue={a.name} />
            <input className={input} name="jobTitle" defaultValue={a.jobTitle ?? ""} />
            <input className={input} name="photoUrl" defaultValue={a.photoUrl ?? ""} />
            <input className={input} name="phone" defaultValue={a.phone ?? ""} />
            <input className={input} name="whatsapp" defaultValue={a.whatsapp ?? ""} />
            <input className={input} name="email" defaultValue={a.email ?? ""} />
            <input className={input} name="languages" defaultValue={a.languages ?? ""} />
            <textarea className="md:col-span-3 min-h-[90px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="bioFr" defaultValue={a.bioFr ?? ""} />
            <textarea className="md:col-span-3 min-h-[90px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="bioEn" defaultValue={a.bioEn ?? ""} />
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" name="active" defaultChecked={a.active} /> Actif
            </label>
            <div className="flex gap-3">
              <button className="rounded-md bg-black px-5 py-2.5 text-[13px] text-white">Enregistrer</button>
              <button formAction={deleteAgentAction.bind(null, a.id)} className="rounded-md border border-red-200 px-5 py-2.5 text-[13px] text-red-600">
                Supprimer
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
