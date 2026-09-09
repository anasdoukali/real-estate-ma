import { desc } from "drizzle-orm";
import { db } from "@/db";
import { valuationRequests } from "@/db/schema";
import { updateValuationAction } from "../actions";
import { VALUATION_STATUSES } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminValuationsPage() {
  const rows = await db.select().from(valuationRequests).orderBy(desc(valuationRequests.createdAt));

  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight">Estimations ({rows.length})</h1>
      <div className="mt-6 space-y-3">
        {rows.map((v) => (
          <div key={v.id} className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-[#e4e4e7] bg-white p-5">
            <div>
              <p className="text-[15px] font-semibold">{v.name}</p>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                {v.phone} · {v.email}
              </p>
              <p className="mt-2 text-[13.5px]">
                {v.propertyType} · {v.neighborhood ?? "—"} · {v.address ?? "—"} · {v.livingArea ?? "—"} m² habitable ·{" "}
                {v.landArea ?? "—"} m² terrain · {v.bedrooms ?? "—"} ch. · {v.bathrooms ?? "—"} sdb · état: {v.condition}
              </p>
              {v.message && <p className="mt-2 max-w-3xl whitespace-pre-line text-[13.5px]">{v.message}</p>}
              <p className="mt-2 text-[12px] text-[#6b7280]">{new Date(v.createdAt).toLocaleString("fr-FR")}</p>
            </div>
            <form action={updateValuationAction} className="flex items-center gap-2">
              <input type="hidden" name="id" value={v.id} />
              <select name="status" defaultValue={v.status} className="h-9 rounded-md border border-[#d4d4d8] px-2 text-[13px]">
                {VALUATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button className="rounded-md bg-black px-4 py-2 text-[13px] text-white">OK</button>
            </form>
          </div>
        ))}
        {rows.length === 0 && <p className="text-[13px] text-[#6b7280]">Aucune demande d&apos;estimation.</p>}
      </div>
    </div>
  );
}
