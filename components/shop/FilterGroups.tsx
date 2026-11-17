"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { colorSwatch } from "@/lib/color";
import { shopHref, type ShopQuery } from "@/lib/shop-query";

type CategoryOption = { name: string; slug: string };

export function FilterGroups({
  categories,
  sizes,
  colors,
  query,
}: {
  categories: CategoryOption[];
  sizes: string[];
  colors: string[];
  query: ShopQuery;
}) {
  const router = useRouter();
  const activeCategory = query.category || "";
  const filtering = Boolean(query.category || query.size || query.color || query.min || query.max || query.q);

  function applyPrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const min = String(data.get("min") || "").trim();
    const max = String(data.get("max") || "").trim();
    router.push(shopHref(query, { min, max }));
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Category</p>
        <div className="mt-3 flex flex-col items-start gap-2">
          <FilterLink href={shopHref(query, { category: "" })} active={!activeCategory}>
            All
          </FilterLink>
          {categories.map((category) => (
            <FilterLink
              key={category.slug}
              href={shopHref(query, { category: category.slug })}
              active={activeCategory === category.slug}
            >
              {category.name}
            </FilterLink>
          ))}
        </div>
      </div>
      {sizes.length ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Link
                key={size}
                href={shopHref(query, { size: query.size === size ? "" : size })}
                className={`min-w-10 border px-2.5 py-1.5 text-center text-sm ${
                  query.size === size ? "border-brand-black bg-brand-black text-white" : "border-brand-line hover:border-brand-black"
                }`}
              >
                {size}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {colors.length ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Color</p>
          <div className="mt-3 flex flex-col items-start gap-2">
            {colors.map((color) => (
              <Link
                key={color}
                href={shopHref(query, { color: query.color === color ? "" : color })}
                className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-sm ${
                  query.color === color ? "border-brand-black bg-brand-black text-white" : "border-brand-line hover:border-brand-black"
                }`}
              >
                <span className="h-2.5 w-2.5 border border-black/15" style={{ backgroundColor: colorSwatch(color) }} />
                {color}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <form key={`${query.min || ""}-${query.max || ""}`} onSubmit={applyPrice}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Price, USD</p>
        <div className="mt-3 flex items-center gap-2">
          <input
            name="min"
            defaultValue={query.min || ""}
            inputMode="decimal"
            placeholder="Min"
            aria-label="Minimum price"
            className="w-full border border-brand-line bg-white px-2 py-2 text-sm outline-none focus:border-brand-black"
          />
          <input
            name="max"
            defaultValue={query.max || ""}
            inputMode="decimal"
            placeholder="Max"
            aria-label="Maximum price"
            className="w-full border border-brand-line bg-white px-2 py-2 text-sm outline-none focus:border-brand-black"
          />
          <button type="submit" className="shrink-0 bg-brand-black px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            Go
          </button>
        </div>
      </form>
      {filtering ? (
        <Link href="/shop" className="inline-block text-[12px] font-semibold uppercase tracking-[0.14em] underline">
          Clear filters
        </Link>
      ) : null}
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`text-sm ${active ? "font-semibold underline" : "text-brand-charcoal hover:text-brand-text"}`}>
      {children}
    </Link>
  );
}
