import { NextResponse } from "next/server";
import { createOrder } from "@/lib/actions";
import { actionError, readBody, requireAdmin } from "@/lib/http";
import { readStore } from "@/lib/store";

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  const store = readStore();
  const orders = [...store.orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json({ orders, products: store.products });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  try {
    return NextResponse.json(await createOrder(await readBody(request)));
  } catch (error) {
    return actionError(error);
  }
}
