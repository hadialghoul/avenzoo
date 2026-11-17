import { NextResponse } from "next/server";
import { createProduct } from "@/lib/actions";
import { actionError, readBody, requireAdmin } from "@/lib/http";
import { readStore } from "@/lib/store";

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  const store = readStore();
  return NextResponse.json({ products: store.products, categories: store.categories });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  try {
    return NextResponse.json(await createProduct(await readBody(request)));
  } catch (error) {
    return actionError(error);
  }
}
