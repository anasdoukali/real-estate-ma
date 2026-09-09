import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    try {
      const optimized = await sharp(buffer)
        .rotate()
        .resize({ width: 2000, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      await writeFile(path.join(dir, name), optimized);
      urls.push(`/uploads/${name}`);
    } catch {
      const fallback = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${path.extname(file.name) || ".jpg"}`;
      await writeFile(path.join(dir, fallback), buffer);
      urls.push(`/uploads/${fallback}`);
    }
  }

  return NextResponse.json({ urls });
}
