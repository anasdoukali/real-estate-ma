"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { PROPERTY_TYPES } from "@/lib/site";

export default function ServiceForm({ lang, service, neighborhoods }: {
  lang: Lang; service: "home-staging" | "confier"; neighborhoods: { name: string; slug: string }[];
}) {
  const en = lang === "en";
  const staging = service === "home-staging";
  const field = `mt-2 h-12 w-full rounded-[20px] border px-4 text-[14px] outline-none focus:border-champagne ${staging ? "border-charcoal/20 bg-white" : "border-sand bg-surface"}`;
  const textarea = `mt-2 min-h-32 w-full rounded-[20px] border p-4 outline-none focus:border-champagne ${staging ? "border-charcoal/20 bg-white" : "border-sand bg-surface"}`;
  const [transaction, setTransaction] = useState("sale");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setState("loading");
    try {
      const res = await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, service }) });
      setState(res.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <div role="status" className="rounded-[20px] border border-champagne bg-surface p-10"><h2 className="font-display text-3xl">{en ? "Request received." : "Demande reçue."}</h2><p className="mt-4 text-secondary">{en ? "An advisor will contact you to discuss your project." : "Un conseiller vous recontactera pour étudier votre projet."}</p></div>;
  return <form onSubmit={submit} className={`rounded-[20px] border p-6 md:p-10 ${staging ? "border-charcoal/15 bg-[#f8f7f3]" : "border-sand bg-page"}`}>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm">{en ? "Sale or rental" : "Vente ou location"}<select name="transaction" className={field} value={transaction} onChange={e => setTransaction(e.target.value)}><option value="sale">{en ? "Sale" : "Vente"}</option><option value="rent">{en ? "Rental" : "Location"}</option></select></label>
      <label className="text-sm">{en ? "Property type" : "Type de bien"}<select name="propertyType" className={field} required defaultValue=""><option value="" disabled>{en ? "Select" : "Sélectionner"}</option>{PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{en ? t.en : t.fr}</option>)}</select></label>
      <label className="text-sm">{en ? "Neighborhood" : "Quartier"}<input name="neighborhood" list="service-neighborhoods" className={field} required maxLength={160}/><datalist id="service-neighborhoods">{neighborhoods.map(n => <option key={n.slug} value={n.name}/>)}</datalist></label>
      <label className="text-sm">{en ? "Desired budget" : "Budget souhaité"} (MAD{!staging && transaction === "rent" ? en ? " / month" : " / mois" : ""})<input name="budget" type="number" min="0.01" max="1000000000000" step="0.01" required className={field}/><span className="mt-2 block text-xs text-secondary">{staging ? en ? "Budget for staging services." : "Budget dédié à la prestation Home Staging." : en ? "Your target sale price or monthly rent." : "Prix de vente ou loyer mensuel souhaité."}</span></label>
      <label className="text-sm">{en ? "Full name" : "Nom complet"}<input name="name" autoComplete="name" required maxLength={160} className={field}/></label>
      <label className="text-sm">{en ? "Phone" : "Téléphone"}<input name="phone" type="tel" autoComplete="tel" required maxLength={60} className={field}/></label>
      <label className="text-sm sm:col-span-2">Email<input name="email" type="email" autoComplete="email" required maxLength={190} className={field}/></label>
      <label className="text-sm sm:col-span-2">{en ? "Tell us about your project (optional)" : "Votre projet (facultatif)"}<textarea name="message" maxLength={5000} className={textarea}/></label>
    </div>
    <button disabled={state === "loading"} className="label-xs mt-6 rounded-[20px] bg-charcoal px-7 py-4 text-white transition-colors hover:bg-ink disabled:opacity-60">{state === "loading" ? en ? "Sending…" : "Envoi…" : staging ? en ? "Request a quote" : "Demander un devis" : en ? "List your property" : "Confiez-nous votre bien"}</button>
    {state === "error" && <p role="alert" className="mt-4 text-sm text-red-600">{en ? "Unable to send. Please try again." : "Envoi impossible. Veuillez réessayer."}</p>}
  </form>;
}
