import { asc } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { deleteTeamUserAction } from "../actions";
import { getSession } from "@/lib/auth";
import { TeamUserForm } from "@/components/admin/TeamUserForm";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const [users, session] = await Promise.all([
    db.select().from(adminUsers).orderBy(asc(adminUsers.createdAt)),
    getSession(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Équipe & accès</h1>
        <p className="mt-1 text-[13.5px] text-[#71717a]">Créez un accès individuel pour chaque membre de l&apos;équipe.</p>
      </div>

      <section className="rounded-lg border border-[#e4e4e7] bg-white p-6">
        <h2 className="text-[14px] font-semibold">Ajouter un compte</h2>
        <TeamUserForm />
      </section>

      <section className="overflow-hidden rounded-lg border border-[#e4e4e7] bg-white">
        <div className="border-b border-[#e4e4e7] px-6 py-4 text-[14px] font-semibold">Comptes actifs</div>
        <div className="divide-y divide-[#e4e4e7]">
          {users.map((user) => {
            const isCurrentUser = String(user.id) === session?.sub;
            return (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="text-[14px] font-medium">{user.name}{isCurrentUser ? " (vous)" : ""}</p>
                  <p className="mt-0.5 text-[13px] text-[#71717a]">{user.email} · {user.role === "admin" ? "Administrateur" : "Équipe"}</p>
                </div>
                {!isCurrentUser && (
                  <form action={deleteTeamUserAction.bind(null, user.id)}>
                    <button className="rounded-md border border-red-200 px-4 py-2 text-[13px] text-red-600">Supprimer l&apos;accès</button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
