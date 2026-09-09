import { desc } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { toggleSubscriberAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const rows = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));

  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight">Newsletter ({rows.length})</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-[#e4e4e7] bg-white">
        <table className="w-full text-[13px]">
          <thead className="border-b border-[#e4e4e7] bg-[#fafafa] text-left text-[12px] uppercase text-[#6b7280]">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Langue</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f1f3]">
            {rows.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3 uppercase">{s.language}</td>
                <td className="px-4 py-3">{new Date(s.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <form action={toggleSubscriberAction.bind(null, s.id, !s.active)}>
                    <button className={s.active ? "text-emerald-600" : "text-[#6b7280]"}>
                      {s.active ? "Actif" : "Inactif"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[#6b7280]">
                  Aucun abonné.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
