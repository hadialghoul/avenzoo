import { NextResponse } from "next/server";
import { updateNav } from "@/lib/actions";
import { actionError, readBody, requireAdmin } from "@/lib/http";
import { readStoreAsync } from "@/lib/store";

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  const store = await readStoreAsync();
  return NextResponse.json({ nav: store.nav });
}

export async function PUT(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  try {
    return NextResponse.json(await updateNav(await readBody(request)));
  } catch (error) {
    return actionError(error);
  }
}
