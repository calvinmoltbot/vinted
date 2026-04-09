import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const { stepId, type, message } = await request.json();

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sql`
      INSERT INTO feedback (step_id, type, message)
      VALUES (${stepId}, ${type}, ${message ?? null})
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json([]);
  }

  try {
    const rows = await sql`
      SELECT id, step_id as "stepId", type, message, created_at as "createdAt"
      FROM feedback ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}
