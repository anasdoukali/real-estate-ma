import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { leads, properties, valuationRequests } from "@/db/schema";

export const dynamic = "force-dynamic";

async function counts() {
  const [row] = await db
    .select({
      total: sql<number>`count(*)`,
      sale: sql<number>`count(*) filter (where transaction_type = 'sale')`,
      rent: sql<number>`count(*) filter (where transaction_type = 'rent')`,
      published: sql<number>`count(*) filter (where status = 'published')`,
      draft: sql<number>`count(*) filter (where status = 'draft')`,
      sold: sql<number>`count(*) filter (where status = 'sold')`,
      rented: sql<number>`count(*) filter (where status = 'rented')`,
    })
    .from(properties);
  const [leadRow] = await db
    .select({ newLeads: sql<number>`count(*) filter (where status = 'new')` })
    .from(leads);
  return { ...row, newLeads: leadRow?.newLeads ?? 0 };
}

export default async function AdminDashboard() {
  const c = await counts();
  const [recentLeads, recentProps, recentValuations] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6),
    db.select().from(properties).orderBy(desc(properties.createdAt)).limit(6),
    db.select().from(valuationRequests).orderBy(desc(valuationRequests.createdAt)).limit(5),
  ]);

  const cards = [
    { label: "Total biens", value: c.total },
    { label: "À vendre", value: c.sale },
    { label: "À louer", value: c.rent },
    { label: "Publiés", value: c.published },
    { label: "Brouillons", value: c.draft },
    { label: "Vendus", value: c.sold },
    { label: "Loués", value: c.rented },
    { label: "Nouvelles demandes", value: c.newLeads },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold tracking-tight">Dashboard</h1>
        <Link href="/admin/properties/new" className="rounded-md bg-black px-4 py-2 text-[13px] text-white">
          + Ajouter un bien
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-[#e4e4e7] bg-white p-5">
            <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">{card.label}</p>
            <p className="mt-3 text-[28px] font-semibold tabular-nums">{Number(card.value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-[#e4e4e7] bg-white">
          <header className="flex items-center justify-between border-b border-[#e4e4e7] px-5 py-3.5">
            <h2 className="text-[14px] font-semibold">Dernières demandes</h2>
            <Link href="/admin/leads" className="text-[12px] text-[#6b7280] hover:text-black">Tout voir</Link>
          </header>
          <ul className="divide-y divide-[#f1f1f3]">
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center justify-between px-5 py-3 text-[13px]">
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-[12px] text-[#6b7280]">{l.email ?? l.phone} · {l.source}</p>
                </div>
                <span className="rounded-full bg-[#f1f1f3] px-2.5 py-1 text-[11px]">{l.status}</span>
              </li>
            ))}
            {recentLeads.length === 0 && <li className="px-5 py-6 text-[13px] text-[#6b7280]">Aucune demande.</li>}
          </ul>
        </section>

        <section className="rounded-lg border border-[#e4e4e7] bg-white">
          <header className="flex items-center justify-between border-b border-[#e4e4e7] px-5 py-3.5">
            <h2 className="text-[14px] font-semibold">Biens récents</h2>
            <Link href="/admin/properties" className="text-[12px] text-[#6b7280] hover:text-black">Tout voir</Link>
          </header>
          <ul className="divide-y divide-[#f1f1f3]">
            {recentProps.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-3 text-[13px]">
                <div>
                  <Link href={`/admin/properties/${p.id}`} className="font-medium hover:underline">{p.titleFr}</Link>
                  <p className="text-[12px] text-[#6b7280]">{p.reference} · {Number(p.price).toLocaleString("fr-FR")} {p.currency}</p>
                </div>
                <span className="rounded-full bg-[#f1f1f3] px-2.5 py-1 text-[11px]">{p.status}</span>
              </li>
            ))}
            {recentProps.length === 0 && <li className="px-5 py-6 text-[13px] text-[#6b7280]">Aucun bien.</li>}
          </ul>
        </section>

        <section className="rounded-lg border border-[#e4e4e7] bg-white lg:col-span-2">
          <header className="flex items-center justify-between border-b border-[#e4e4e7] px-5 py-3.5">
            <h2 className="text-[14px] font-semibold">Demandes d&apos;estimation</h2>
            <Link href="/admin/valuations" className="text-[12px] text-[#6b7280] hover:text-black">Tout voir</Link>
          </header>
          <ul className="divide-y divide-[#f1f1f3]">
            {recentValuations.map((v) => (
              <li key={v.id} className="flex items-center justify-between px-5 py-3 text-[13px]">
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-[12px] text-[#6b7280]">
                    {v.propertyType} · {v.neighborhood} · {v.livingArea ?? "—"} m²
                  </p>
                </div>
                <span className="rounded-full bg-[#f1f1f3] px-2.5 py-1 text-[11px]">{v.status}</span>
              </li>
            ))}
            {recentValuations.length === 0 && <li className="px-5 py-6 text-[13px] text-[#6b7280]">Aucune estimation.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
