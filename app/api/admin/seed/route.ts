import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/http";
import { seedStore } from "@/lib/store";

export async function POST() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  try {
    await seedStore();
    return NextResponse.json({ ok: true, message: "Store seeded with initial data" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
