import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: "No database" }, { status: 500 });
  }

  const body = await request.json();

  try {
    // Build dynamic update — only update fields that are provided
    const fields = body;
    if (fields.question !== undefined) {
      await sql`UPDATE steps SET question = ${fields.question}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.subtitle !== undefined) {
      await sql`UPDATE steps SET subtitle = ${fields.subtitle}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.placeholder !== undefined) {
      await sql`UPDATE steps SET placeholder = ${fields.placeholder}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.type !== undefined) {
      await sql`UPDATE steps SET type = ${fields.type}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.section !== undefined) {
      await sql`UPDATE steps SET section = ${fields.section}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.options !== undefined) {
      await sql`UPDATE steps SET options = ${JSON.stringify(fields.options)}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.min !== undefined) {
      await sql`UPDATE steps SET min_val = ${fields.min}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.max !== undefined) {
      await sql`UPDATE steps SET max_val = ${fields.max}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.step !== undefined) {
      await sql`UPDATE steps SET step_size = ${fields.step}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.prefix !== undefined) {
      await sql`UPDATE steps SET prefix = ${fields.prefix}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.suffix !== undefined) {
      await sql`UPDATE steps SET suffix = ${fields.suffix}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.required !== undefined) {
      await sql`UPDATE steps SET required = ${fields.required}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.sort_order !== undefined) {
      await sql`UPDATE steps SET sort_order = ${fields.sort_order}, updated_at = now() WHERE id = ${id}`;
    }
    if (fields.active !== undefined) {
      await sql`UPDATE steps SET active = ${fields.active}, updated_at = now() WHERE id = ${id}`;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: "No database" }, { status: 500 });
  }

  try {
    await sql`DELETE FROM steps WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
