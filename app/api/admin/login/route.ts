import { NextResponse } from "next/server";
import { credentialsOk } from "@/lib/auth";
import { COOKIE, createToken } from "@/lib/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = String(body?.email || "");
  const password = String(body?.password || "");
  if (!credentialsOk(email, password)) {
    return NextResponse.json({ error: "Email or password is not correct." }, { status: 401 });
  }
  const token = await createToken(email.trim().toLowerCase());
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
