import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Stockage non configuré. Ajoutez les variables Supabase dans Vercel." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Envoi invalide." }, { status: 400 });
  }

  const files = formData.getAll("files");
  const file = files[0];
  if (
    files.length !== 1 ||
    !(file instanceof File) ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type)
  ) {
    return NextResponse.json(
      { error: "Envoyez une seule image JPG, PNG ou WEBP à la fois." },
      { status: 400 },
    );
  }
  if (!file.size || file.size > 4_000_000) {
    return NextResponse.json({ error: "L’image doit faire moins de 4 Mo après compression." }, { status: 413 });
  }

  let optimized: Buffer;
  try {
    optimized = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Image illisible ou trop grande. Essayez un autre fichier." },
      { status: 400 },
    );
  }

  const objectPath = `properties/${randomUUID()}.webp`;
  try {
    const response = await fetch(
      `${supabaseUrl}/storage/v1/object/property-images/${objectPath}`,
      {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "image/webp",
          "x-upsert": "false",
        },
        body: new Uint8Array(optimized),
        signal: AbortSignal.timeout(25_000),
      },
    );
    if (!response.ok) {
      console.error("Supabase Storage upload rejected", response.status);
      return NextResponse.json(
        { error: "Supabase a refusé l’image. Vérifiez le bucket et la clé serveur." },
        { status: 502 },
      );
    }
    return NextResponse.json({
      urls: [`${supabaseUrl}/storage/v1/object/public/property-images/${objectPath}`],
    });
  } catch {
    return NextResponse.json(
      { error: "Stockage indisponible. Veuillez réessayer dans un instant." },
      { status: 502 },
    );
  }
}
