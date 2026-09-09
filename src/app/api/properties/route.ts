import { NextResponse } from "next/server";
import { listProperties } from "@/lib/queries";
import { toCard } from "@/lib/mappers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  if (idsParam) {
    const ids = idsParam
      .split(",")
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));
    if (!ids.length) return NextResponse.json({ items: [] });
    const all = await listProperties({ limit: 500 });
    return NextResponse.json({
      items: all
        .filter((p) => ids.includes(p.id))
        .map((p) => ({ ...toCard(p), features: p.features })),
    });
  }

  const items = await listProperties({
    transaction: searchParams.get("transaction") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    neighborhood: searchParams.get("neighborhood") ?? undefined,
    limit: Number(searchParams.get("limit") ?? 24),
  });
  return NextResponse.json({ items: items.map((p) => ({ ...toCard(p), features: p.features })) });
}
