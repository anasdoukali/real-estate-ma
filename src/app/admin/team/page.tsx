import { asc } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { deleteTeamUserAction, createTeamUserAction } from "../actions";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const input = "h-10 w-full rounded-md border border-[#d4d4d8] px-3 text-[13.5px] outline-none focus:border-black";

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
        <form action={createTeamUserAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <input className={input} name="name" placeholder="Nom complet" required />
          <input className={input} name="email" type="email" placeholder="Email professionnel" required />
          <input className={input} name="password" type="password" minLength={10} placeholder="Mot de passe (10 caractères minimum)" required />
          <select className={input} name="role" defaultValue="worker">
            <option value="worker">Membre de l&apos;équipe</option>
            <option value="admin">Administrateur</option>
          </select>
          <button className="w-fit rounded-md bg-black px-5 py-2.5 text-[13px] text-white">Créer le compte</button>
        </form>
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
