export type ShopQuery = {
  category?: string;
  collection?: string;
  q?: string;
  size?: string;
  color?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: string;
};

export function shopHref(current: ShopQuery, patch: Partial<ShopQuery> = {}) {
  const next: Record<string, string | undefined> = { ...current };
  for (const [key, value] of Object.entries(patch)) {
    if (!value) delete next[key];
    else next[key] = value;
  }
  if (Object.keys(patch).some((key) => key !== "page")) delete next.page;
  if (next.sort === "newest") delete next.sort;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
  }
  const search = params.toString();
  return search ? `/shop?${search}` : "/shop";
}
