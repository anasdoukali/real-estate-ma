import { NEIGHBORHOOD_RATINGS, NEIGHBORHOOD_TRAITS, type NeighborhoodProfile } from "@/lib/neighborhood-profile";

export default function NeighborhoodProfileFields({ profile }: { profile?: NeighborhoodProfile | null }) {
  return (
    <fieldset className="min-w-0 rounded-lg border border-[#e4e4e7] p-4 md:col-span-3">
      <legend className="px-2 text-[14px] font-semibold">Vie de quartier</legend>
      <p className="mb-4 text-[13px] text-[#6b7280]">Les critères non renseignés ne sont pas affichés sur le site.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NEIGHBORHOOD_RATINGS.map(({ key, fr }) => (
          <label key={key} className="space-y-2 text-[13px]">
            <span className="block">{fr}</span>
            <select name={"rating_" + key} defaultValue={profile?.ratings?.[key] ?? ""} className="h-10 w-full rounded-md border border-[#d4d4d8] bg-white px-3">
              <option value="">Non renseigné</option>
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5 — {"★".repeat(value)}{"☆".repeat(5 - value)}</option>)}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NEIGHBORHOOD_TRAITS.map(({ key, fr, placeholder }) => (
          <div key={key} className="space-y-3">
            {key.startsWith("distance") ? (
              <label className="block space-y-2 text-[13px]">
                <span>{fr}</span>
                <input name={key} defaultValue={profile?.traits?.[key]?.fr || profile?.traits?.[key]?.en || ""} maxLength={160} placeholder={placeholder} className="h-10 w-full rounded-md border border-[#d4d4d8] px-3" />
              </label>
            ) : (["fr", "en"] as const).map((lang) => (
              <label key={lang} className="block space-y-2 text-[13px]">
                <span>{fr} ({lang.toUpperCase()})</span>
                <input name={key + "_" + lang} defaultValue={profile?.traits?.[key]?.[lang] ?? ""} maxLength={160} placeholder={lang === "fr" ? placeholder : ""} className="h-10 w-full rounded-md border border-[#d4d4d8] px-3" />
              </label>
            ))}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
