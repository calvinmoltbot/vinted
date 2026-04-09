import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST() {
  const sql = getDb();
  if (sql) {
    try {
      await sql`DELETE FROM business_plans WHERE id = 'default-plan'`;
    } catch {
      // DB might not be set up yet — that's fine
    }
  }
  return NextResponse.json({ ok: true });
}
