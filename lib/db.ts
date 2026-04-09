import { neon } from "@neondatabase/serverless";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export async function initDb() {
  const sql = getDb();
  if (!sql) return;

  await sql`
    CREATE TABLE IF NOT EXISTS business_plans (
      id TEXT PRIMARY KEY DEFAULT 'default-plan',
      answers JSONB NOT NULL DEFAULT '{}',
      current_step INTEGER NOT NULL DEFAULT 0,
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      step_id TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS steps (
      id TEXT PRIMARY KEY,
      section TEXT NOT NULL,
      type TEXT NOT NULL,
      question TEXT NOT NULL,
      subtitle TEXT,
      placeholder TEXT,
      options JSONB,
      min_val NUMERIC,
      max_val NUMERIC,
      step_size NUMERIC,
      prefix TEXT,
      suffix TEXT,
      required BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}
