import type { Product } from "./types";

const NEW_WINDOW_MS = 1000 * 60 * 60 * 24 * 45;

export function isNewArrival(product: Product, now = Date.now()) {
  if (typeof product.newArrival === "boolean") return product.newArrival;
  const created = new Date(product.createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return now - created <= NEW_WINDOW_MS;
}

export function byNewest(a: Product, b: Product) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function uniqueLabels(values: string[]) {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const value of values) {
    const label = value.trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }
  return labels;
}
