"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { PROPERTY_TYPES } from "@/lib/site";

const field =
  "h-12 w-full border border-sand bg-surface px-4 text-[14px] outline-none transition-colors focus:border-champagne";

export default function ValuationForm({
  lang,
  neighborhoods,
}: {
  lang: Lang;
  neighborhoods: { name: string; slug: string }[];
}) {
  const en = lang === "en";
  const [step, setStep] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [form, setForm] = useState({
    propertyType: "villa",
    neighborhood: "",
    address: "",
    livingArea: "",
    landArea: "",
    bedrooms: "",
    bathrooms: "",
    condition: "bon",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const steps = [
    { n: 1, fr: "Type de bien", en: "Property type" },
    { n: 2, fr: "Localisation", en: "Location" },
    { n: 3, fr: "Caractéristiques", en: "Characteristics" },
    { n: 4, fr: "Coordonnées", en: "Contact details" },
  ];

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/valuations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <div className="border border-champagne bg-surface p-12">
        <p className="font-display text-[34px]">{en ? "Request received." : "Demande reçue."}</p>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-secondary">
          {en
            ? "Thank you. One of our valuation specialists will get back to you with a personalised estimate."
            : "Merci. Un spécialiste de l'estimation vous recontacte avec une évaluation personnalisée de votre bien."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-stone bg-surface">
      <div className="grid grid-cols-4 border-b border-stone">
        {steps.map((s) => (
          <button
            type="button"
            key={s.n}
            onClick={() => setStep(s.n)}
            className={`px-3 py-5 text-left transition-colors ${step === s.n ? "bg-page" : "hover:bg-page/60"}`}
          >
            <span className={`label-xs ${step >= s.n ? "text-accent" : "text-secondary"}`}>0{s.n}</span>
            <p className="mt-2 hidden text-[13px] font-medium sm:block">{en ? s.en : s.fr}</p>
          </button>
        ))}
      </div>

      <div className="p-7 md:p-10">
        {step === 1 && (
          <div>
            <p className="label-xs text-secondary">{en ? "What type of property?" : "Quel type de bien ?"}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set("propertyType", t.value)}
                  className={`border px-6 py-4 text-[14px] transition-colors ${
                    form.propertyType === t.value
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-sand text-secondary hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  {en ? t.en : t.fr}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <select className={field} value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)}>
              <option value="">{en ? "Neighborhood" : "Quartier"}</option>
              {neighborhoods.map((n) => (
                <option key={n.slug} value={n.name}>
                  {n.name}
                </option>
              ))}
            </select>
            <input
              className={field}
              placeholder={en ? "Address" : "Adresse"}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <input
              className={field}
              type="number"
              placeholder={en ? "Living area m²" : "Surface habitable m²"}
              value={form.livingArea}
              onChange={(e) => set("livingArea", e.target.value)}
            />
            <input
              className={field}
              type="number"
              placeholder={en ? "Land area m²" : "Surface terrain m²"}
              value={form.landArea}
              onChange={(e) => set("landArea", e.target.value)}
            />
            <input
              className={field}
              type="number"
              placeholder={en ? "Bedrooms" : "Chambres"}
              value={form.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
            />
            <input
              className={field}
              type="number"
              placeholder={en ? "Bathrooms" : "Salles de bain"}
              value={form.bathrooms}
              onChange={(e) => set("bathrooms", e.target.value)}
            />
            <select className={field} value={form.condition} onChange={(e) => set("condition", e.target.value)}>
              <option value="neuf">{en ? "New" : "Neuf"}</option>
              <option value="bon">{en ? "Good condition" : "Bon état"}</option>
              <option value="a-renover">{en ? "To renovate" : "À rénover"}</option>
            </select>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className={field}
              required
              placeholder={en ? "Full name" : "Nom complet"}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            <input
              className={field}
              required
              placeholder={en ? "Phone" : "Téléphone"}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            <input
              className={field}
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <textarea
              className="min-h-[110px] border border-sand p-4 text-[14px] outline-none focus:border-champagne sm:col-span-2"
              placeholder={en ? "Additional information" : "Informations complémentaires"}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
            />
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`label-xs text-secondary hover:text-charcoal ${step === 1 ? "invisible" : ""}`}
          >
            ← {en ? "Back" : "Retour"}
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="label-xs bg-charcoal px-9 py-4 text-white transition-colors hover:bg-ink"
            >
              {en ? "Continue" : "Continuer"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={state === "loading"}
              className="label-xs bg-charcoal px-9 py-4 text-white transition-colors hover:bg-charcoal disabled:opacity-60"
            >
              {state === "loading" ? "..." : en ? "Request my valuation" : "Demander mon estimation"}
            </button>
          )}
        </div>
        {state === "error" && <p className="mt-4 text-[13px] text-red-500">{en ? "Error" : "Une erreur est survenue."}</p>}
      </div>
    </form>
  );
}
