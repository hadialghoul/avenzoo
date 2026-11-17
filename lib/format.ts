import type { OrderStatus } from "./types";

export function money(value: number) {
  const cents = Math.round(value * 100) % 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents === 0 ? 0 : 2,
    maximumFractionDigits: cents === 0 ? 0 : 2,
  }).format(value);
}

export function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "item";
}

export function cleanText(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, max);
}

export function cleanList(value: unknown) {
  const source = Array.isArray(value) ? value.join(",") : String(value ?? "");
  const seen = new Set<string>();
  const items: string[] = [];
  for (const part of source.split(",")) {
    const item = part.trim().slice(0, 24);
    if (!item) continue;
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(item);
  }
  return items.slice(0, 12);
}

export function cleanImages(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item).trim())
    .filter(
      (item) =>
        item.startsWith("/images/") ||
        item.startsWith("/uploads/") ||
        item.startsWith("https://"),
    )
    .slice(0, 6);
}

export const orderStatuses: { id: OrderStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "confirmed", label: "Confirmed" },
  { id: "preparing", label: "Preparing" },
  { id: "out_for_delivery", label: "Out for delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export function statusLabel(id: string) {
  return orderStatuses.find((status) => status.id === id)?.label ?? id;
}

export function isOrderStatus(value: string): value is OrderStatus {
  return orderStatuses.some((status) => status.id === value);
}
