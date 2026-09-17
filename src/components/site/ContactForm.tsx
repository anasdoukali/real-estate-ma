"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";

const field =
  "h-13 w-full border border-black bg-surface px-4 py-4 text-[14px] outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black";

export default function ContactForm({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [form, setForm] = useState({
    firstname: "",
    name: "",
    phone: "",
    email: "",
    intent: "acheter",
    message: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const intents = [
    { value: "acheter", fr: "Acheter", en: "Buy" },
    { value: "investir", fr: "Investir", en: "Invest" },
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${form.firstname} ${form.name}`.trim(),
        phone: form.phone,
        email: form.email,
        intent: form.intent,
        message: form.message,
        source: "contact",
      }),
    });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <div className="border border-champagne bg-surface p-10">
        <p className="font-display text-[30px]">{en ? "Thank you." : "Merci."}</p>
        <p className="mt-4 text-[15px] text-secondary">
          {en
            ? "Your message has been received. An advisor will contact you shortly."
            : "Votre message a bien été reçu. Un conseiller vous recontacte très rapidement."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={field}
          required
          placeholder={en ? "First name" : "Prénom"}
          value={form.firstname}
          onChange={(e) => setForm({ ...form, firstname: e.target.value })}
        />
        <input
          className={field}
          required
          placeholder={en ? "Last name" : "Nom"}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className={field}
          required
          placeholder={en ? "Phone" : "Téléphone"}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className={field}
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <p className="label-xs mb-3 text-secondary">{en ? "I would like to" : "Je souhaite"}</p>
        <div className="flex flex-wrap gap-2">
          {intents.map((i) => (
            <button
              key={i.value}
              type="button"
              onClick={() => setForm({ ...form, intent: i.value })}
              className={`border px-5 py-3 text-[13px] transition-colors ${
                form.intent === i.value
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-black bg-surface text-secondary hover:border-charcoal hover:text-charcoal"
              }`}
            >
              {en ? i.en : i.fr}
            </button>
          ))}
        </div>
      </div>

      <textarea
        className="min-h-[160px] w-full border border-black bg-surface p-4 text-[14px] outline-none focus:border-black focus:ring-1 focus:ring-black"
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <button
        type="submit"
        disabled={state === "loading"}
        className="label-xs bg-charcoal px-10 py-4 text-white transition-colors hover:bg-ink disabled:opacity-60"
      >
        {state === "loading" ? "..." : en ? "Send message" : "Envoyer le message"}
      </button>
      {state === "error" && <p className="text-[13px] text-red-500">{en ? "Error" : "Une erreur est survenue."}</p>}
    </form>
  );
}
