import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const PLAN_ID = "default-plan";

export async function GET() {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ answers: {}, currentStep: 0 });
  }

  try {
    const rows = await sql`
      SELECT answers, current_step as "currentStep", completed
      FROM business_plans WHERE id = ${PLAN_ID}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ answers: {}, currentStep: 0 });
    }
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ answers: {}, currentStep: 0 });
  }
}

export async function PUT(request: Request) {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ ok: true });
  }

  const { answers, currentStep } = await request.json();

  try {
    await sql`
      INSERT INTO business_plans (id, answers, current_step, updated_at)
      VALUES (${PLAN_ID}, ${JSON.stringify(answers)}, ${currentStep}, now())
      ON CONFLICT (id) DO UPDATE SET
        answers = ${JSON.stringify(answers)},
        current_step = ${currentStep},
        updated_at = now()
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
