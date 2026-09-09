"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f6f7] px-5">
      <form action={formAction} className="w-full max-w-sm rounded-lg border border-[#e4e4e7] bg-white p-8">
        <h1 className="text-[20px] font-semibold tracking-tight">Connexion admin</h1>
        <p className="mt-2 text-[13px] text-[#6b7280]">
          Accès réservé à l&apos;équipe de l&apos;agence. Le premier compte créé devient administrateur.
        </p>
        <div className="mt-7 space-y-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            defaultValue="admin@agency.ma"
            className="h-11 w-full rounded-md border border-[#d4d4d8] px-3 text-[14px] outline-none focus:border-black"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Mot de passe"
            className="h-11 w-full rounded-md border border-[#d4d4d8] px-3 text-[14px] outline-none focus:border-black"
          />
        </div>
        {state?.error && <p className="mt-4 text-[13px] text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 h-11 w-full rounded-md bg-black text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
