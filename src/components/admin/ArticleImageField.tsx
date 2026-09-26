"use client";

import { useState } from "react";

type ArticleImageFieldProps = { defaultValue?: string; name?: string };

export function ArticleImageField({ defaultValue = "", name = "coverImage" }: ArticleImageFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File | undefined) {
    if (!file || uploading) return;
    setUploading(true);
    setStatus(null);
    try {
      const data = new FormData();
      data.append("files", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data, credentials: "same-origin" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !Array.isArray(result.urls) || typeof result.urls[0] !== "string") {
        throw new Error(result.error || "Envoi impossible.");
      }
      setUrl(result.urls[0]);
      setStatus("Image téléversée.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Envoi impossible.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        className="h-10 w-full rounded-md border border-[#d4d4d8] px-3 text-[13.5px] outline-none focus:border-black"
        name={name}
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="URL image de couverture"
      />
      <label className="block text-[12px] text-[#71717a]">
        <span className="mr-2">Ou téléverser une image :</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => upload(event.target.files?.[0])} disabled={uploading} />
      </label>
      {status && <p className={status === "Image téléversée." ? "text-[12px] text-emerald-700" : "text-[12px] text-red-600"}>{status}</p>}
    </div>
  );
}
