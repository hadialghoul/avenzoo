"use client";

import { useRouter } from "next/navigation";
import { shopHref, type ShopQuery } from "@/lib/shop-query";

const options = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "name", label: "Name" },
];

export function SortSelect({ query, value }: { query: ShopQuery; value: string }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
      <span className="sr-only">Sort</span>
      <select
        value={value}
        aria-label="Sort products"
        onChange={(event) => router.push(shopHref(query, { sort: event.target.value === "newest" ? "" : event.target.value }))}
        className="border border-brand-line bg-white px-3 py-2 text-[13px] font-medium normal-case tracking-normal"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
