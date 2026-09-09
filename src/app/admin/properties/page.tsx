import Link from "next/link";
import Image from "next/image";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { agents, neighborhoods, properties, propertyImages } from "@/db/schema";
import { deletePropertyAction, duplicatePropertyAction, setPropertyStatusAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const rows = await db
    .select({
      p: properties,
      hood: neighborhoods.name,
      agent: agents.name,
      cover: propertyImages.imageUrl,
    })
    .from(properties)
    .leftJoin(neighborhoods, eq(properties.neighborhoodId, neighborhoods.id))
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .leftJoin(propertyImages, eq(propertyImages.propertyId, properties.id))
    .orderBy(desc(properties.createdAt));

  const seen = new Set<number>();
  const list = rows.filter((r) => {
    if (seen.has(r.p.id)) return false;
    seen.add(r.p.id);
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold tracking-tight">Biens ({list.length})</h1>
        <Link href="/admin/properties/new" className="rounded-md bg-black px-4 py-2 text-[13px] text-white">
          + Ajouter un bien
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[#e4e4e7] bg-white">
        <table className="w-full min-w-[1000px] text-[13px]">
          <thead className="border-b border-[#e4e4e7] bg-[#fafafa] text-left text-[12px] uppercase tracking-wide text-[#6b7280]">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Réf.</th>
              <th className="px-4 py-3">Bien</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Transaction</th>
              <th className="px-4 py-3">Quartier</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f1f3]">
            {list.map((r) => (
              <tr key={r.p.id} className="align-middle">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-16 overflow-hidden rounded bg-[#f1f1f3]">
                    {r.cover && <Image src={r.cover} alt="" fill sizes="64px" className="object-cover" />}
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#6b7280]">{r.p.reference}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/properties/${r.p.id}`} className="font-medium hover:underline">
                    {r.p.titleFr}
                  </Link>
                </td>
                <td className="px-4 py-3">{r.p.propertyType}</td>
                <td className="px-4 py-3">{r.p.transactionType === "rent" ? "Location" : "Vente"}</td>
                <td className="px-4 py-3">{r.hood ?? "—"}</td>
                <td className="px-4 py-3 tabular-nums">{Number(r.p.price).toLocaleString("fr-FR")} {r.p.currency}</td>
                <td className="px-4 py-3">{r.agent ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[#f1f1f3] px-2.5 py-1 text-[11px]">{r.p.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-[12px]">
                    <Link href={`/admin/properties/${r.p.id}`} className="text-[#2563eb] hover:underline">
                      Éditer
                    </Link>
                    <form action={duplicatePropertyAction.bind(null, r.p.id)}>
                      <button className="text-[#6b7280] hover:text-black">Dupliquer</button>
                    </form>
                    {r.p.status !== "published" ? (
                      <form action={setPropertyStatusAction.bind(null, r.p.id, "published")}>
                        <button className="text-emerald-600 hover:underline">Publier</button>
                      </form>
                    ) : (
                      <form action={setPropertyStatusAction.bind(null, r.p.id, "draft")}>
                        <button className="text-[#6b7280] hover:text-black">Dépublier</button>
                      </form>
                    )}
                    <form action={setPropertyStatusAction.bind(null, r.p.id, "sold")}>
                      <button className="text-[#6b7280] hover:text-black">Vendu</button>
                    </form>
                    <form action={setPropertyStatusAction.bind(null, r.p.id, "rented")}>
                      <button className="text-[#6b7280] hover:text-black">Loué</button>
                    </form>
                    <form action={setPropertyStatusAction.bind(null, r.p.id, "archived")}>
                      <button className="text-[#6b7280] hover:text-black">Archiver</button>
                    </form>
                    <form action={deletePropertyAction.bind(null, r.p.id)}>
                      <button className="text-red-600 hover:underline">Supprimer</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-[#6b7280]">
                  Aucun bien pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
