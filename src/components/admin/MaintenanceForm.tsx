"use client";

import { useActionState } from "react";
import { saveMaintenance } from "@/app/admin/maintenance/actions";

export default function MaintenanceForm({ enabled, description }: { enabled: boolean; description: string }) {
  const [state, action, pending] = useActionState(saveMaintenance, {});
  return <form action={action} className="mt-6 max-w-3xl space-y-6 rounded-lg border border-stone bg-white p-6">
    <p className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${enabled ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>
      {enabled ? "Maintenance activée" : "Site en ligne"}
    </p>
    <label className="block text-sm font-medium">Présentation de l’agence
      <textarea name="description" defaultValue={description} maxLength={2000} rows={6} className="mt-2 w-full rounded-lg border border-sand p-4 font-normal outline-none focus:border-charcoal"/>
      <span className="mt-2 block text-xs font-normal text-muted">Affichée sur la page Coming soon. Les coordonnées proviennent des paramètres de l’agence.</span>
    </label>
    <div className="flex flex-wrap gap-3">
      <button name="enabled" value={String(!enabled)} disabled={pending} className={`rounded-lg px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 ${enabled ? "bg-emerald-700" : "bg-charcoal"}`}>
        {pending ? "Enregistrement…" : enabled ? "Désactiver la maintenance" : "Activer la maintenance"}
      </button>
      <button name="enabled" value={String(enabled)} disabled={pending} className="rounded-lg border border-sand px-5 py-3 text-sm disabled:opacity-50">Enregistrer la description</button>
      <a href="/maintenance" target="_blank" rel="noreferrer" className="px-2 py-3 text-sm underline">Aperçu de la page ↗</a>
    </div>
    <p className="text-sm text-muted">Les visiteurs voient la page d’attente sur toutes les adresses du site. Votre session administrateur vous permet de continuer à consulter et modifier le site. Pour voir le résultat côté visiteur, ouvrez une fenêtre de navigation privée.</p>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-emerald-700">{state.success}</p>}
  </form>;
}
