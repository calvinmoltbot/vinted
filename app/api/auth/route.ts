import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PLAN_PASSWORD = process.env.PLAN_PASSWORD ?? "relist2024";

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  if (password === PLAN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("relist-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
