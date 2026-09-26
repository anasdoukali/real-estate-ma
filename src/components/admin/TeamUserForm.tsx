"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTeamUserAction, type ActionState } from "@/app/admin/actions";

const input = "h-10 w-full rounded-md border border-[#d4d4d8] px-3 text-[13.5px] outline-none focus:border-black";

export function TeamUserForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createTeamUserAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="mt-5 grid gap-4 md:grid-cols-2">
      <input className={input} name="name" placeholder="Nom complet" required />
      <input className={input} name="email" type="email" placeholder="Email professionnel" required />
      <input className={input} name="password" type="password" minLength={10} placeholder="Mot de passe (10 caractères minimum)" required />
      <select className={input} name="role" defaultValue="worker">
        <option value="worker">Membre de l&apos;équipe</option>
        <option value="admin">Administrateur</option>
      </select>
      <div className="md:col-span-2">
        {state.error && <p role="alert" className="mb-3 text-[13px] text-red-600">{state.error}</p>}
        {state.ok && <p role="status" className="mb-3 text-[13px] text-emerald-700">Compte créé.</p>}
        <button disabled={pending} className="w-fit rounded-md bg-black px-5 py-2.5 text-[13px] text-white disabled:opacity-50">
          {pending ? "Création…" : "Créer le compte"}
        </button>
      </div>
    </form>
  );
}
