import { NextResponse } from "next/server";
import { getSession } from "./auth";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Please sign in again." }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function readBody(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return {};
  return body;
}

export function actionError(error: unknown) {
  const message = error instanceof Error ? error.message : "Could not save that change.";
  return NextResponse.json({ error: message }, { status: 400 });
}
