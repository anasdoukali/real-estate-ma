import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { agents, leads, properties } from "@/db/schema";
import { updateLeadAction } from "../actions";
import { LEAD_STATUSES } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const rows = await db
    .select({ l: leads, property: properties.titleFr, propertySlug: properties.slug, agent: agents.name })
    .from(leads)
    .leftJoin(properties, eq(leads.propertyId, properties.id))
    .leftJoin(agents, eq(leads.agentId, agents.id))
    .orderBy(desc(leads.createdAt));

  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight">Demandes ({rows.length})</h1>
      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div key={r.l.id} className="rounded-lg border border-[#e4e4e7] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold">{r.l.name}</p>
                <p className="mt-1 text-[13px] text-[#6b7280]">
                  {r.l.phone} · {r.l.email} · source: {r.l.source}
                  {r.l.intent ? ` · intention: ${r.l.intent}` : ""}
                </p>
                {r.property && (
                  <p className="mt-1 text-[13px]">
                    Bien :{" "}
                    <a href={`/biens/${r.propertySlug}`} className="text-[#2563eb] hover:underline">
                      {r.property}
                    </a>
                    {r.agent ? ` · Agent : ${r.agent}` : ""}
                  </p>
                )}
                {r.l.message && <p className="mt-3 max-w-3xl whitespace-pre-line text-[13.5px]">{r.l.message}</p>}
                <div className="mt-3 flex gap-4 text-[12.5px]">
                  {r.l.phone && <a href={`tel:${r.l.phone}`} className="text-[#2563eb]">Appeler</a>}
                  {r.l.phone && (
                    <a
                      href={`https://wa.me/${r.l.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600"
                    >
                      WhatsApp
                    </a>
                  )}
                  {r.l.email && <a href={`mailto:${r.l.email}`} className="text-[#2563eb]">Email</a>}
                  <span className="text-[#6b7280]">{new Date(r.l.createdAt).toLocaleString("fr-FR")}</span>
                </div>
              </div>
              <form action={updateLeadAction} className="flex flex-col gap-2">
                <input type="hidden" name="id" value={r.l.id} />
                <select
                  name="status"
                  defaultValue={r.l.status}
                  className="h-9 rounded-md border border-[#d4d4d8] px-2 text-[13px]"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <textarea
                  name="notes"
                  defaultValue={r.l.notes ?? ""}
                  placeholder="Notes internes"
                  className="min-h-[70px] w-64 rounded-md border border-[#d4d4d8] p-2 text-[13px]"
                />
                <button className="rounded-md bg-black px-4 py-2 text-[13px] text-white">Mettre à jour</button>
              </form>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-[13px] text-[#6b7280]">Aucune demande.</p>}
      </div>
    </div>
  );
}
