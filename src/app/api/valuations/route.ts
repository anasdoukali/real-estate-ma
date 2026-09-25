import { NextResponse } from "next/server";
import { db } from "@/db";
import { valuationRequests } from "@/db/schema";

function num(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name || (!body?.email && !body?.phone)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const [row] = await db
      .insert(valuationRequests)
      .values({
        name: String(body.name).slice(0, 160),
        phone: body.phone ? String(body.phone).slice(0, 60) : null,
        email: body.email ? String(body.email).slice(0, 190) : null,
        propertyType: body.propertyType ? String(body.propertyType).slice(0, 40) : null,
        neighborhood: body.neighborhood ? String(body.neighborhood).slice(0, 160) : null,
        address: body.address ? String(body.address).slice(0, 240) : null,
        livingArea: num(body.livingArea),
        landArea: num(body.landArea),
        bedrooms: num(body.bedrooms),
        bathrooms: num(body.bathrooms),
        condition: body.condition ? String(body.condition).slice(0, 60) : null,
        message: body.message ? String(body.message) : null,
      })
      .returning({ id: valuationRequests.id });
    return NextResponse.json({ ok: true, id: row.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
