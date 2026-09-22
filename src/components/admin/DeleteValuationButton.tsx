"use client";

import { useState, useTransition } from "react";
import { deleteValuationAction } from "@/app/admin/actions";

export default function DeleteValuationButton({ id, name }: { id: number; name: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function remove() {
    if (!window.confirm(`Supprimer la demande d’estimation de ${name} ? Cette action est définitive.`)) return;
    setError("");
    startTransition(async () => {
      try {
        const result = await deleteValuationAction(id);
        if (result.error) setError(result.error);
      } catch {
        setError("La suppression a échoué. Veuillez réessayer.");
      }
    });
  }

  return (
    <div>
      <button type="button" onClick={remove} disabled={pending} className="rounded-md border border-red-200 px-4 py-2 text-[13px] text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50">
        {pending ? "Suppression..." : "Supprimer"}
      </button>
      {error && <p role="alert" className="mt-2 text-[13px] text-red-600">{error}</p>}
    </div>
  );
}
