import Link from "next/link";
import { shopHref, type ShopQuery } from "@/lib/shop-query";

export function Pagination({ page, pages, query }: { page: number; pages: number; query: ShopQuery }) {
  if (pages <= 1) return null;
  return (
    <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Pages">
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
        <Link
          key={number}
          href={shopHref({ ...query, page: undefined }, { page: number === 1 ? "" : String(number) })}
          className={`grid h-10 min-w-10 place-items-center px-3 text-sm ${
            number === page ? "bg-brand-black text-white" : "bg-brand-mist hover:bg-brand-line"
          }`}
          aria-current={number === page ? "page" : undefined}
        >
          {number}
        </Link>
      ))}
    </nav>
  );
}
