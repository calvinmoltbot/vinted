import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { steps as defaultSteps } from "@/config/steps";
import type { Step } from "@/types";

function dbRowToStep(row: Record<string, unknown>): Step {
  return {
    id: row.id as string,
    section: row.section as Step["section"],
    type: row.type as Step["type"],
    question: row.question as string,
    subtitle: (row.subtitle as string) || undefined,
    placeholder: (row.placeholder as string) || undefined,
    options: row.options as Step["options"],
    min: row.min_val != null ? Number(row.min_val) : undefined,
    max: row.max_val != null ? Number(row.max_val) : undefined,
    step: row.step_size != null ? Number(row.step_size) : undefined,
    prefix: (row.prefix as string) || undefined,
    suffix: (row.suffix as string) || undefined,
    required: row.required as boolean,
  };
}

export async function GET() {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json(defaultSteps);
  }

  try {
    const rows = await sql`
      SELECT * FROM steps WHERE active = true ORDER BY sort_order ASC
    `;

    if (rows.length === 0) {
      return NextResponse.json(defaultSteps);
    }

    return NextResponse.json(rows.map(dbRowToStep));
  } catch {
    return NextResponse.json(defaultSteps);
  }
}

// Seed DB from static config
export async function PUT() {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: "No database" }, { status: 500 });
  }

  try {
    for (let i = 0; i < defaultSteps.length; i++) {
      const s = defaultSteps[i];
      await sql`
        INSERT INTO steps (id, section, type, question, subtitle, placeholder, options, min_val, max_val, step_size, prefix, suffix, required, sort_order)
        VALUES (
          ${s.id}, ${s.section}, ${s.type}, ${s.question},
          ${s.subtitle ?? null}, ${s.placeholder ?? null},
          ${s.options ? JSON.stringify(s.options) : null},
          ${s.min ?? null}, ${s.max ?? null}, ${s.step ?? null},
          ${s.prefix ?? null}, ${s.suffix ?? null},
          ${s.required ?? false}, ${i}
        )
        ON CONFLICT (id) DO UPDATE SET
          section = EXCLUDED.section,
          type = EXCLUDED.type,
          question = EXCLUDED.question,
          subtitle = EXCLUDED.subtitle,
          placeholder = EXCLUDED.placeholder,
          options = EXCLUDED.options,
          min_val = EXCLUDED.min_val,
          max_val = EXCLUDED.max_val,
          step_size = EXCLUDED.step_size,
          prefix = EXCLUDED.prefix,
          suffix = EXCLUDED.suffix,
          required = EXCLUDED.required,
          sort_order = EXCLUDED.sort_order,
          updated_at = now()
      `;
    }
    return NextResponse.json({ ok: true, count: defaultSteps.length });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Create a new step
export async function POST(request: Request) {
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: "No database" }, { status: 500 });
  }

  const body = await request.json();
  const { id, section, type, question, subtitle, placeholder, options, min, max, step: stepSize, prefix, suffix, required, sort_order } = body;

  try {
    await sql`
      INSERT INTO steps (id, section, type, question, subtitle, placeholder, options, min_val, max_val, step_size, prefix, suffix, required, sort_order)
      VALUES (
        ${id}, ${section}, ${type}, ${question},
        ${subtitle ?? null}, ${placeholder ?? null},
        ${options ? JSON.stringify(options) : null},
        ${min ?? null}, ${max ?? null}, ${stepSize ?? null},
        ${prefix ?? null}, ${suffix ?? null},
        ${required ?? false}, ${sort_order ?? 999}
      )
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
