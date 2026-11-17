import { NextResponse } from "next/server";
import { createOffer } from "@/lib/actions";
import { actionError, readBody, requireAdmin } from "@/lib/http";
import { readStore } from "@/lib/store";

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  return NextResponse.json({ offers: readStore().offers });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  try {
    return NextResponse.json(await createOffer(await readBody(request)));
  } catch (error) {
    return actionError(error);
  }
}
