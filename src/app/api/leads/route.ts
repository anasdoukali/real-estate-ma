import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name || (!body?.email && !body?.phone)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const [row] = await db
      .insert(leads)
      .values({
        name: String(body.name).slice(0, 160),
        phone: body.phone ? String(body.phone).slice(0, 60) : null,
        email: body.email ? String(body.email).slice(0, 190) : null,
        message: body.message ? String(body.message) : null,
        intent: body.intent ? String(body.intent).slice(0, 40) : null,
        propertyId: body.propertyId ? Number(body.propertyId) : null,
        agentId: body.agentId ? Number(body.agentId) : null,
        source: body.source ? String(body.source).slice(0, 40) : "contact",
      })
      .returning({ id: leads.id });
    return NextResponse.json({ ok: true, id: row.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
