"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginAction, type ActionState } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <div className="grid min-h-svh bg-warm text-charcoal lg:grid-cols-2">
      <div className="relative min-h-[30svh] overflow-hidden bg-charcoal lg:sticky lg:top-0 lg:h-svh">
        <Image
          src="https://images.pexels.com/photos/9730025/pexels-photo-9730025.jpeg?auto=compress&cs=tinysrgb&w=2000"
          alt="Villa avec piscine"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-charcoal/15" />
        <Link href="/" className="absolute bottom-8 left-8 text-[13px] text-white transition-colors hover:text-champagne lg:bottom-12 lg:left-12">
          ← Retour au site
        </Link>
      </div>
      <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:py-20">
      <form action={formAction} className="w-full max-w-md">
        <Image src="/brand/louka-vendy-black.png" alt="Louka & Vendy" width={350} height={140} className="mb-12 h-auto w-64 object-contain" />
        <p className="label-xs text-champagne">Espace agence</p>
        <h1 className="mt-4 text-[30px] font-semibold tracking-tight sm:text-[36px]">Connexion admin</h1>
        <p className="mt-2 text-[13px] text-[#6b7280]">
          Accès réservé à l&apos;équipe de l&apos;agence. Le premier compte créé devient administrateur.
        </p>
        <div className="mt-7 space-y-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            aria-label="Email"
            autoComplete="username"
            defaultValue="admin@agency.ma"
            className="h-14 w-full rounded-md border border-sand bg-white px-4 text-[14px] outline-none focus:border-champagne focus:ring-1 focus:ring-champagne"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Mot de passe"
            aria-label="Mot de passe"
            autoComplete="current-password"
            className="h-14 w-full rounded-md border border-sand bg-white px-4 text-[14px] outline-none focus:border-champagne focus:ring-1 focus:ring-champagne"
          />
        </div>
        {state?.error && <p className="mt-4 text-[13px] text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 h-14 w-full rounded-md bg-champagne text-[14px] font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-white disabled:opacity-50"
        >
          {pending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      </div>
    </div>
  );
}
