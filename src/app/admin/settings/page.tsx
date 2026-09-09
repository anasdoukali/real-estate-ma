import { getSettings } from "@/lib/queries";
import { saveSettingsAction } from "../actions";

export const dynamic = "force-dynamic";

const input = "h-10 w-full rounded-md border border-[#d4d4d8] px-3 text-[13.5px] outline-none focus:border-black";

export default async function AdminSettingsPage() {
  const s = await getSettings();

  const fields: [string, string, string | number | null][] = [
    ["agencyName", "Nom de l'agence", s.agencyName],
    ["phone", "Téléphone", s.phone],
    ["whatsapp", "WhatsApp", s.whatsapp],
    ["email", "Email", s.email],
    ["address", "Adresse", s.address],
    ["instagram", "Instagram", s.instagram],
    ["facebook", "Facebook", s.facebook],
    ["linkedin", "LinkedIn", s.linkedin],
    ["defaultCurrency", "Devise par défaut", s.defaultCurrency],
    ["seoTitle", "SEO title", s.seoTitle],
    ["yearsExperience", "Années d'expérience", s.yearsExperience],
    ["propertiesSold", "Transactions", s.propertiesSold],
    ["activeProperties", "Biens actifs", s.activeProperties],
    ["clientCount", "Quartiers couverts", s.clientCount],
  ];

  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-tight">Paramètres</h1>
      <form action={saveSettingsAction} className="mt-6 grid gap-4 rounded-lg border border-[#e4e4e7] bg-white p-6 md:grid-cols-3">
        {fields.map(([name, lbl, value]) => (
          <div key={name}>
            <p className="text-[12px] font-medium text-[#6b7280]">{lbl}</p>
            <input className={`${input} mt-1.5`} name={name} defaultValue={value ?? ""} />
          </div>
        ))}
        <div className="md:col-span-3">
          <p className="text-[12px] font-medium text-[#6b7280]">SEO description</p>
          <textarea
            name="seoDescription"
            defaultValue={s.seoDescription ?? ""}
            className="mt-1.5 min-h-[90px] w-full rounded-md border border-[#d4d4d8] p-3 text-[13.5px]"
          />
        </div>
        <button className="rounded-md bg-black px-5 py-2.5 text-[13px] text-white">Enregistrer</button>
      </form>
    </div>
  );
}
