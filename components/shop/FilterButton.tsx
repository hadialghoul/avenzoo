"use client";

import { useEffect, useState } from "react";
import { FilterGroups } from "@/components/shop/FilterGroups";
import type { ShopQuery } from "@/lib/shop-query";

type CategoryOption = { name: string; slug: string };

export function FilterButton(props: {
  categories: CategoryOption[];
  sizes: string[];
  colors: string[];
  query: ShopQuery;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" className="border border-brand-black px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] lg:hidden" onClick={() => setOpen(true)}>
        Filter
      </button>
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Close filters"
          className={`absolute inset-0 bg-black/45 transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col bg-white transition-transform duration-300 motion-reduce:transition-none ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
            <p className="font-display text-3xl uppercase">Filter</p>
            <button type="button" className="text-[12px] uppercase tracking-[0.16em]" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <FilterGroups {...props} />
          </div>
        </aside>
      </div>
    </>
  );
}
