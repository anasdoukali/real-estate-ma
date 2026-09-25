import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { parseServiceRequest } from "@/lib/service-request";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const values = parseServiceRequest(body);
  if (!values) return NextResponse.json({ error: "Invalid service request" }, { status: 400 });
  try {
    const [row] = await db.insert(leads).values(values).$returningId();
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (error) {
    console.error("Service request failed", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
