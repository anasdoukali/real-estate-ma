"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";

const field =
  "h-12 w-full border border-sand bg-white px-4 text-[14px] outline-none transition-colors focus:border-champagne";

export default function InquiryForm({
  lang,
  propertyId,
  agentId,
  defaultMessage,
  source = "property_form",
  compact = false,
}: {
  lang: Lang;
  propertyId?: number;
  agentId?: number | null;
  defaultMessage?: string;
  source?: string;
  compact?: boolean;
}) {
  const en = lang === "en";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: defaultMessage ?? "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, propertyId, agentId, source }),
    });
    setState(res.ok ? "done" : "error");
    if (res.ok) setForm({ name: "", phone: "", email: "", message: defaultMessage ?? "" });
  }

  if (state === "done") {
    return (
      <div className="border border-champagne bg-white p-6 text-[14px]">
        <p className="label-xs text-champagne">{en ? "Message sent" : "Message envoyé"}</p>
        <p className="mt-3 text-muted">
          {en
            ? "Thank you. One of our advisors will contact you shortly."
            : "Merci. Un conseiller vous recontacte dans les meilleurs délais."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? "space-y-3" : "space-y-3"}>
      <input
        className={field}
        required
        placeholder={en ? "Name" : "Nom"}
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
      <textarea
        className="min-h-[110px] w-full border border-sand bg-white p-4 text-[14px] outline-none transition-colors focus:border-champagne"
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="label-xs w-full bg-charcoal py-4 text-white transition-colors hover:bg-champagne disabled:opacity-60"
      >
        {state === "loading" ? "..." : en ? "Request information" : "Demander des informations"}
      </button>
      {state === "error" && (
        <p className="text-[13px] text-red-500">{en ? "Something went wrong." : "Une erreur est survenue."}</p>
      )}
    </form>
  );
}
