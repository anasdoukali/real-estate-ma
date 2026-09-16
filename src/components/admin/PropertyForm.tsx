"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { savePropertyAction, type PropertyPayload } from "@/app/admin/actions";
import { prepareImage } from "@/lib/prepare-image";
import { FEATURES, PROPERTY_TYPES, PROPERTY_STATUSES } from "@/lib/site";

type ImageItem = { imageUrl: string; isCover: boolean };

export type PropertyFormValues = Partial<PropertyPayload> & { id?: number };

const input =
  "h-10 w-full rounded-md border border-[#d4d4d8] px-3 text-[13.5px] outline-none focus:border-black bg-white";
const label = "text-[12px] font-medium text-[#6b7280]";

export default function PropertyForm({
  initial,
  neighborhoods,
  agents,
}: {
  initial?: PropertyFormValues;
  neighborhoods: { id: number; name: string }[];
  agents: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ImageItem[]>(
    (initial?.images ?? []).map((i) => ({ imageUrl: i.imageUrl, isCover: i.isCover })),
  );
  const [features, setFeatures] = useState<string[]>(initial?.features ?? []);
  const [form, setForm] = useState({
    reference: initial?.reference ?? `MK-${Math.floor(1000 + Math.random() * 8999)}`,
    transactionType: initial?.transactionType ?? "sale",
    propertyType: initial?.propertyType ?? "villa",
    titleFr: initial?.titleFr ?? "",
    titleEn: initial?.titleEn ?? "",
    descriptionFr: initial?.descriptionFr ?? "",
    descriptionEn: initial?.descriptionEn ?? "",
    price: initial?.price ?? "",
    currency: initial?.currency ?? "MAD",
    priceType: initial?.priceType ?? "fixed",
    rentalFrequency: initial?.rentalFrequency ?? "month",
    city: initial?.city ?? "Marrakech",
    neighborhoodId: initial?.neighborhoodId ? String(initial.neighborhoodId) : "",
    address: initial?.address ?? "",
    latitude: initial?.latitude != null ? String(initial.latitude) : "31.6295",
    longitude: initial?.longitude != null ? String(initial.longitude) : "-7.9811",
    locationVisibility: initial?.locationVisibility ?? "exact",
    livingArea: initial?.livingArea != null ? String(initial.livingArea) : "",
    landArea: initial?.landArea != null ? String(initial.landArea) : "",
    bedrooms: initial?.bedrooms != null ? String(initial.bedrooms) : "",
    bathrooms: initial?.bathrooms != null ? String(initial.bathrooms) : "",
    livingRooms: initial?.livingRooms != null ? String(initial.livingRooms) : "",
    garages: initial?.garages != null ? String(initial.garages) : "",
    totalFloors: initial?.totalFloors != null ? String(initial.totalFloors) : "",
    yearBuilt: initial?.yearBuilt != null ? String(initial.yearBuilt) : "",
    videoUrl: initial?.videoUrl ?? "",
    agentId: initial?.agentId ? String(initial.agentId) : "",
    isFeatured: initial?.isFeatured ?? false,
    isExclusive: initial?.isExclusive ?? false,
    isNew: initial?.isNew ?? true,
    isHotOffer: initial?.isHotOffer ?? false,
  });

  function set(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function upload(files: FileList | null) {
    if (!files?.length || uploading) return;
    setUploading(true);
    setError(null);
    const failures: string[] = [];
    try {
      for (const file of Array.from(files)) {
        try {
          const image = await prepareImage(file);
          const fd = new FormData();
          fd.append("files", image, "property-image.webp");
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: fd,
            credentials: "same-origin",
          });
          const responseText = await res.text();
          let data: { error?: string; urls?: unknown[] } | null = null;
          try {
            data = responseText ? JSON.parse(responseText) : null;
          } catch {
            data = null;
          }
          if (!res.ok) {
            throw new Error(
              data?.error ||
                (res.status === 413
                  ? "Image trop volumineuse pour Vercel."
                  : `Envoi impossible (erreur ${res.status}).`),
            );
          }
          if (!Array.isArray(data?.urls) || !data.urls.every((url: unknown) => typeof url === "string")) {
            throw new Error("Réponse du stockage invalide.");
          }
          const uploadedUrls = data.urls as string[];
          setImages((prev) => [
            ...prev,
            ...uploadedUrls.map((imageUrl) => ({ imageUrl, isCover: false })),
          ]);
        } catch (error) {
          failures.push(`${file.name} : ${error instanceof Error ? error.message : "Envoi impossible."}`);
        }
      }
      if (failures.length) setError(failures.join(" · "));
    } finally {
      setUploading(false);
    }
  }

  function move(index: number, dir: number) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function save(status: string) {
    setSaving(true);
    setError(null);
    const num = (v: string) => (v === "" ? null : Number(v));
    try {
      const result = await savePropertyAction({
        id: initial?.id,
        reference: form.reference,
        transactionType: form.transactionType,
        propertyType: form.propertyType,
        titleFr: form.titleFr,
        titleEn: form.titleEn,
        descriptionFr: form.descriptionFr,
        descriptionEn: form.descriptionEn,
        price: form.price || "0",
        currency: form.currency,
        priceType: form.priceType,
        rentalFrequency: form.transactionType === "rent" ? form.rentalFrequency : undefined,
        city: form.city,
        neighborhoodId: form.neighborhoodId ? Number(form.neighborhoodId) : null,
        address: form.address,
        latitude: num(form.latitude),
        longitude: num(form.longitude),
        locationVisibility: form.locationVisibility,
        livingArea: num(form.livingArea),
        landArea: num(form.landArea),
        bedrooms: num(form.bedrooms),
        bathrooms: num(form.bathrooms),
        livingRooms: num(form.livingRooms),
        garages: num(form.garages),
        totalFloors: num(form.totalFloors),
        yearBuilt: num(form.yearBuilt),
        videoUrl: form.videoUrl,
        agentId: form.agentId ? Number(form.agentId) : null,
        status,
        isFeatured: form.isFeatured,
        isExclusive: form.isExclusive,
        isNew: form.isNew,
        isHotOffer: form.isHotOffer,
        features,
        images,
      });
      if (result?.ok) router.push("/admin/properties");
    } catch {
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</p>}

      <Section title="Général">
        <Field label="Référence">
          <input className={input} value={form.reference} onChange={(e) => set("reference", e.target.value)} />
        </Field>
        <Field label="Transaction">
          <select className={input} value={form.transactionType} onChange={(e) => set("transactionType", e.target.value)}>
            <option value="sale">Vente</option>
            <option value="rent">Location</option>
          </select>
        </Field>
        <Field label="Type">
          <select className={input} value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.fr}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Titre FR" wide>
          <input className={input} value={form.titleFr} onChange={(e) => set("titleFr", e.target.value)} />
        </Field>
        <Field label="Titre EN" wide>
          <input className={input} value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
        </Field>
      </Section>

      <Section title="Prix">
        <Field label="Prix">
          <input className={input} type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
        </Field>
        <Field label="Devise">
          <select className={input} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
            <option value="MAD">MAD</option>
            <option value="EUR">EUR</option>
          </select>
        </Field>
        <Field label="Affichage du prix">
          <select className={input} value={form.priceType} onChange={(e) => set("priceType", e.target.value)}>
            <option value="fixed">Fixe</option>
            <option value="starting_from">À partir de</option>
            <option value="on_request">Sur demande</option>
          </select>
        </Field>
        {form.transactionType === "rent" && (
          <Field label="Fréquence">
            <select className={input} value={form.rentalFrequency} onChange={(e) => set("rentalFrequency", e.target.value)}>
              <option value="month">Par mois</option>
              <option value="day">Par nuit</option>
              <option value="year">Par an</option>
            </select>
          </Field>
        )}
      </Section>

      <Section title="Localisation">
        <Field label="Quartier">
          <select className={input} value={form.neighborhoodId} onChange={(e) => set("neighborhoodId", e.target.value)}>
            <option value="">—</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ville">
          <input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="Adresse" wide>
          <input className={input} value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="Latitude">
          <input className={input} value={form.latitude} onChange={(e) => set("latitude", e.target.value)} />
        </Field>
        <Field label="Longitude">
          <input className={input} value={form.longitude} onChange={(e) => set("longitude", e.target.value)} />
        </Field>
        <Field label="Visibilité">
          <select className={input} value={form.locationVisibility} onChange={(e) => set("locationVisibility", e.target.value)}>
            <option value="exact">Exacte</option>
            <option value="approximate">Approximative</option>
            <option value="hidden">Masquée</option>
          </select>
        </Field>
      </Section>

      <Section title="Détails">
        {[
          ["livingArea", "Surface habitable m²"],
          ["landArea", "Terrain m²"],
          ["bedrooms", "Chambres"],
          ["bathrooms", "Salles de bain"],
          ["livingRooms", "Salons"],
          ["garages", "Garages"],
          ["totalFloors", "Étages"],
          ["yearBuilt", "Année de construction"],
        ].map(([key, lbl]) => (
          <Field key={key} label={lbl}>
            <input
              className={input}
              type="number"
              value={form[key as keyof typeof form] as string}
              onChange={(e) => set(key as keyof typeof form, e.target.value)}
            />
          </Field>
        ))}
      </Section>

      <Section title="Équipements" full>
        <div className="flex flex-wrap gap-2">
          {FEATURES.map((f) => {
            const active = features.includes(f.value);
            return (
              <button
                key={f.value}
                type="button"
                onClick={() =>
                  setFeatures((prev) => (active ? prev.filter((x) => x !== f.value) : [...prev, f.value]))
                }
                className={`rounded-md border px-3 py-2 text-[12.5px] transition-colors ${
                  active ? "border-black bg-black text-white" : "border-[#d4d4d8] bg-white text-[#3f3f46]"
                }`}
              >
                {f.fr}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Description" full>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className={label}>Description FR</p>
            <textarea
              className="mt-1.5 min-h-[200px] w-full rounded-md border border-[#d4d4d8] p-3 text-[13.5px] outline-none focus:border-black"
              value={form.descriptionFr}
              onChange={(e) => set("descriptionFr", e.target.value)}
            />
          </div>
          <div>
            <p className={label}>Description EN</p>
            <textarea
              className="mt-1.5 min-h-[200px] w-full rounded-md border border-[#d4d4d8] p-3 text-[13.5px] outline-none focus:border-black"
              value={form.descriptionEn}
              onChange={(e) => set("descriptionEn", e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section title="Agent & média">
        <Field label="Agent">
          <select className={input} value={form.agentId} onChange={(e) => set("agentId", e.target.value)}>
            <option value="">—</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Vidéo (URL embed)" wide>
          <input className={input} value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} />
        </Field>
      </Section>

      <Section title="Photos" full>
        <div className="rounded-lg border border-dashed border-[#d4d4d8] p-6 text-center">
          <input
            type="file"
            multiple
            disabled={uploading || saving}
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => upload(e.target.files)}
            className="mx-auto block text-[13px]"
          />
          <p className="mt-2 text-[12px] text-[#6b7280]">
            JPG, PNG ou WEBP — compression automatique. {uploading && "Téléversement en cours..."}
          </p>
        </div>
        {images.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {images.map((img, i) => (
              <div key={img.imageUrl + i} className="overflow-hidden rounded-md border border-[#e4e4e7] bg-white">
                <div className="relative aspect-[4/3]">
                  <Image src={img.imageUrl} alt="" fill sizes="200px" className="object-cover" />
                  {(img.isCover || (i === 0 && !images.some((x) => x.isCover))) && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-black px-2 py-0.5 text-[10px] text-white">
                      COVER
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 px-2 py-1.5 text-[11px]">
                  <button type="button" onClick={() => move(i, -1)} className="text-[#6b7280] hover:text-black">←</button>
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.map((x, idx) => ({ ...x, isCover: idx === i })))}
                    className="text-[#2563eb]"
                  >
                    Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-red-600"
                  >
                    Suppr.
                  </button>
                  <button type="button" onClick={() => move(i, 1)} className="text-[#6b7280] hover:text-black">→</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Labels & statut" full>
        <div className="flex flex-wrap gap-5 text-[13px]">
          {([
            ["isFeatured", "Featured"],
            ["isExclusive", "Exclusivité"],
            ["isNew", "Nouveau"],
            ["isHotOffer", "Hot offer"],
          ] as const).map(([key, lbl]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form[key] as boolean}
                onChange={(e) => set(key, e.target.checked)}
              />
              {lbl}
            </label>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-[#6b7280]">
          Statuts disponibles : {PROPERTY_STATUSES.join(", ")}
        </p>
      </Section>

      <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-[#e4e4e7] bg-white/95 px-1 py-4 backdrop-blur">
        <button
          onClick={() => save("draft")}
          disabled={saving || uploading || !form.titleFr}
          className="rounded-md border border-[#d4d4d8] px-5 py-2.5 text-[13px] disabled:opacity-50"
        >
          Enregistrer le brouillon
        </button>
        <button
          onClick={() => save("published")}
          disabled={saving || uploading || !form.titleFr}
          className="rounded-md bg-black px-5 py-2.5 text-[13px] text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Publier"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children, full = false }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <section className="rounded-lg border border-[#e4e4e7] bg-white p-6">
      <h2 className="text-[14px] font-semibold">{title}</h2>
      <div className={full ? "mt-5" : "mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4"}>{children}</div>
    </section>
  );
}

function Field({ label: text, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <p className="text-[12px] font-medium text-[#6b7280]">{text}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
