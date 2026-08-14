import { NextResponse } from "next/server";
import { createSession, verifyAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Identifiants requis." }, { status: 400 });
  }

  const valid = await verifyAdminCredentials(email, password);
  if (!valid) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }

  await createSession(email);
  return NextResponse.json({ ok: true });
}
