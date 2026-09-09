"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";

export default function NewsletterForm({ lang, dark = false }: { lang: Lang; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, language: lang }),
    });
    setState(res.ok ? "done" : "error");
    if (res.ok) setEmail("");
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className={`flex flex-col gap-3 sm:flex-row ${dark ? "" : ""}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={lang === "en" ? "Your email address" : "Votre adresse email"}
          className={`h-14 flex-1 border px-5 text-[14px] outline-none transition-colors ${
            dark
              ? "border-white/20 bg-transparent text-white placeholder:text-white/45 focus:border-champagne"
              : "border-sand bg-white text-charcoal placeholder:text-muted focus:border-champagne"
          }`}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className={`label-xs h-14 px-9 transition-colors ${
            dark ? "bg-champagne text-white hover:bg-white hover:text-charcoal" : "bg-charcoal text-white hover:bg-champagne"
          }`}
        >
          {state === "loading" ? "..." : lang === "en" ? "Subscribe" : "S'inscrire"}
        </button>
      </div>
      {state === "done" && (
        <p className={`mt-3 text-[13px] ${dark ? "text-champagne" : "text-champagne"}`}>
          {lang === "en" ? "Thank you — you are subscribed." : "Merci — votre inscription est confirmée."}
        </p>
      )}
      {state === "error" && (
        <p className="mt-3 text-[13px] text-red-500">
          {lang === "en" ? "Something went wrong." : "Une erreur est survenue."}
        </p>
      )}
    </form>
  );
}
