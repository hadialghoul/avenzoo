import { NextResponse } from "next/server";
import { deleteCategory, updateCategory } from "@/lib/actions";
import { actionError, readBody, requireAdmin } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  try {
    const { id } = await context.params;
    return NextResponse.json(await updateCategory(id, await readBody(request)));
  } catch (error) {
    return actionError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  try {
    const { id } = await context.params;
    return NextResponse.json(await deleteCategory(id));
  } catch (error) {
    return actionError(error);
  }
}
