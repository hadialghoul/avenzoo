import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { FilterButton } from "@/components/shop/FilterButton";
import { FilterGroups } from "@/components/shop/FilterGroups";
import { Pagination } from "@/components/shop/Pagination";
import { SortSelect } from "@/components/shop/SortSelect";
import { byNewest, isNewArrival, uniqueLabels } from "@/lib/catalog";
import { shopHref, type ShopQuery } from "@/lib/shop-query";
import { categoryName, readStoreAsync } from "@/lib/store";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shirts, trousers, outerwear, and accessories from Avenzo in Tyre.",
};

const PAGE_SIZE = 12;

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value || "").trim();
}

function sortProducts(products: Product[], sort: string) {
  const next = [...products];
  if (sort === "price-asc") next.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
  else if (sort === "price-desc") next.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
  else if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));
  else next.sort(byNewest);
  return next;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query: ShopQuery = {
    category: one(params.category),
    q: one(params.q),
    size: one(params.size),
    color: one(params.color),
    min: one(params.min),
    max: one(params.max),
    sort: one(params.sort),
    page: one(params.page),
    collection: one(params.collection) === "trending" ? "trending" : one(params.collection) === "new" ? "new" : "",
  };
  const store = await readStoreAsync();
  const active = store.categories.find((category) => category.slug === query.category);
  const needle = (query.q || "").toLowerCase();
  const sort = query.sort === "price-asc" || query.sort === "price-desc" || query.sort === "name" ? query.sort : "newest";
  let low = query.min && Number.isFinite(Number(query.min)) ? Number(query.min) : null;
  let high = query.max && Number.isFinite(Number(query.max)) ? Number(query.max) : null;
  if (low !== null && high !== null && low > high) {
    const swap = low;
    low = high;
    high = swap;
  }

  const scoped = store.products.filter((product) => {
    const categoryOk = !active || product.categoryId === active.id;
    const collectionOk =
      query.collection === "new" ? isNewArrival(product) : query.collection === "trending" ? product.featured : true;
    const text = `${product.name} ${product.description}`.toLowerCase();
    return categoryOk && collectionOk && (!needle || text.includes(needle));
  });
  const sizes = uniqueLabels(scoped.flatMap((product) => product.sizes));
  const colors = uniqueLabels(scoped.flatMap((product) => product.colors));
  const matched = sortProducts(
    scoped.filter((product) => {
      if (query.size && !product.sizes.includes(query.size)) return false;
      if (query.color && !product.colors.includes(query.color)) return false;
      if (low !== null && product.price < low) return false;
      if (high !== null && product.price > high) return false;
      return true;
    }),
    sort,
  );
  const pages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  const requested = Number(query.page);
  const page = Math.min(pages, Math.max(1, Number.isFinite(requested) && requested > 0 ? requested : 1));
  const visible = matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const collectionLabel = query.collection === "new" ? "New arrivals" : query.collection === "trending" ? "Trending" : "";
  const title = query.q ? `Search “${query.q}”` : active ? active.name : collectionLabel || "All products";
  const filterProps = {
    categories: store.categories.map((category) => ({ name: category.name, slug: category.slug })),
    sizes,
    colors,
    query: { ...query, sort: sort === "newest" ? "" : sort, page: page > 1 ? String(page) : "" },
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10 md:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">{collectionLabel || "Shop"}</p>
      <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h1 className="font-display text-6xl uppercase leading-[0.86] md:text-8xl">{title}</h1>
        <p className="max-w-sm text-sm leading-relaxed text-brand-charcoal">
          {active?.description || "Everyday menswear from Tyre. Open a piece, choose a size, and order on WhatsApp."}
        </p>
      </div>

      <div className="mt-12 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-x-12">
        <aside className="sticky top-28 hidden lg:block">
          <FilterGroups {...filterProps} />
        </aside>
        <div>
          <div className="flex items-center justify-between gap-3 border-b border-brand-line pb-4">
            <p className="text-sm text-brand-charcoal">
              {matched.length} {matched.length === 1 ? "piece" : "pieces"}
            </p>
            <div className="flex items-center gap-2">
              <FilterButton {...filterProps} />
              <SortSelect query={filterProps.query} value={sort} />
            </div>
          </div>
          {visible.length ? (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} categoryName={categoryName(store, product.categoryId)} />
              ))}
            </div>
          ) : (
            <div className="py-24">
              <p className="font-display text-5xl uppercase leading-none">Nothing matches.</p>
              <Link href={shopHref(filterProps.query, { size: "", color: "", min: "", max: "", q: "", category: "", collection: "" })} className="btn-ghost mt-8">
                Clear filters
              </Link>
            </div>
          )}
          <Pagination page={page} pages={pages} query={filterProps.query} />
        </div>
      </div>
    </div>
  );
}
