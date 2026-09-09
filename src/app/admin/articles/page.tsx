import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { deleteArticleAction, saveArticleAction } from "../actions";

export const dynamic = "force-dynamic";

const input = "h-10 w-full rounded-md border border-[#d4d4d8] px-3 text-[13.5px] outline-none focus:border-black";

export default async function AdminArticlesPage() {
  const rows = await db.select().from(articles).orderBy(desc(articles.createdAt));

  return (
    <div className="space-y-8">
      <h1 className="text-[22px] font-semibold tracking-tight">Articles</h1>

      <section className="rounded-lg border border-[#e4e4e7] bg-white p-6">
        <h2 className="text-[14px] font-semibold">Nouvel article</h2>
        <form action={saveArticleAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <input className={input} name="titleFr" placeholder="Titre FR" required />
          <input className={input} name="titleEn" placeholder="Title EN" />
          <input className={input} name="coverImage" placeholder="URL image de couverture" />
          <input className={input} name="category" placeholder="Catégorie" />
          <textarea className="min-h-[80px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="excerptFr" placeholder="Chapô FR" />
          <textarea className="min-h-[80px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="excerptEn" placeholder="Excerpt EN" />
          <textarea className="min-h-[200px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="contentFr" placeholder="Contenu FR" />
          <textarea className="min-h-[200px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="contentEn" placeholder="Content EN" />
          <select className={input} name="status" defaultValue="draft">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
          <button className="rounded-md bg-black px-5 py-2.5 text-[13px] text-white">Créer</button>
        </form>
      </section>

      <div className="space-y-4">
        {rows.map((a) => (
          <form key={a.id} action={saveArticleAction} className="grid gap-4 rounded-lg border border-[#e4e4e7] bg-white p-6 md:grid-cols-2">
            <input type="hidden" name="id" value={a.id} />
            <input type="hidden" name="slug" value={a.slug} />
            <input className={input} name="titleFr" defaultValue={a.titleFr} />
            <input className={input} name="titleEn" defaultValue={a.titleEn ?? ""} />
            <input className={input} name="coverImage" defaultValue={a.coverImage ?? ""} />
            <input className={input} name="category" defaultValue={a.category ?? ""} />
            <textarea className="min-h-[70px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="excerptFr" defaultValue={a.excerptFr ?? ""} />
            <textarea className="min-h-[70px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="excerptEn" defaultValue={a.excerptEn ?? ""} />
            <textarea className="min-h-[170px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="contentFr" defaultValue={a.contentFr ?? ""} />
            <textarea className="min-h-[170px] rounded-md border border-[#d4d4d8] p-3 text-[13.5px]" name="contentEn" defaultValue={a.contentEn ?? ""} />
            <select className={input} name="status" defaultValue={a.status}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
            <div className="flex gap-3">
              <button className="rounded-md bg-black px-5 py-2.5 text-[13px] text-white">Enregistrer</button>
              <button formAction={deleteArticleAction.bind(null, a.id)} className="rounded-md border border-red-200 px-5 py-2.5 text-[13px] text-red-600">
                Supprimer
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
