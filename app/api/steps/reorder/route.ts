import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: "No database" }, { status: 500 });
  }

  const { orderedIds } = await request.json() as { orderedIds: string[] };

  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await sql`UPDATE steps SET sort_order = ${i}, updated_at = now() WHERE id = ${orderedIds[i]}`;
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
