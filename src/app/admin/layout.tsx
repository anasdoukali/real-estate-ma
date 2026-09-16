import type { ReactNode } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/properties", label: "Biens" },
  { href: "/admin/properties/new", label: "Ajouter un bien" },
  { href: "/admin/leads", label: "Demandes" },
  { href: "/admin/valuations", label: "Estimations" },
  { href: "/admin/agents", label: "Agents" },
  { href: "/admin/neighborhoods", label: "Quartiers" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/settings", label: "Paramètres" },
  { href: "/admin/maintenance", label: "Maintenance du site" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#f6f6f7] text-[#14161a]">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[#e4e4e7] bg-white lg:flex">
        <div className="border-b border-[#e4e4e7] px-6 py-5">
          <p className="text-[15px] font-semibold tracking-tight">Admin</p>
          <p className="mt-1 text-[12px] text-[#6b7280]">{session.email}</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-[13.5px] text-[#3f3f46] transition-colors hover:bg-[#f1f1f3] hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[#e4e4e7] p-3">
          <Link href="/" className="block rounded-md px-3 py-2 text-[13px] text-[#3f3f46] hover:bg-[#f1f1f3]">
            ↗ Voir le site
          </Link>
          <form action={logoutAction}>
            <button className="mt-1 w-full rounded-md px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50">
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#e4e4e7] bg-white px-5 py-4 lg:hidden">
          <span className="text-[15px] font-semibold">Admin</span>
          <div className="flex flex-wrap gap-3 text-[12px]">
            {NAV.slice(0, 5).map((n) => (
              <Link key={n.href} href={n.href} className="text-[#3f3f46]">
                {n.label}
              </Link>
            ))}
            <Link href="/admin/maintenance" className="text-[#3f3f46]">Maintenance</Link>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-5 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
