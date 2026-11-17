import Link from "next/link";
import { brand, generalWhatsApp } from "@/lib/brand";
import type { NavSettings } from "@/lib/types";

type NavCategory = { name: string; slug: string };

export function Footer({ categories, nav }: { categories: NavCategory[]; nav: NavSettings }) {
  return (
    <footer className="border-t border-brand-line bg-white">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <img src="/images/Avenzo-logo.JPG" alt="Avenzo" className="h-28 w-28 object-cover" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-charcoal">
            Everyday menswear from Tyre (Sour), South Lebanon. Ordered on WhatsApp, delivered across the country.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Shop</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            {nav.newArrival ? (
              <Link href="/shop?collection=new" className="hover:underline">
                New arrival
              </Link>
            ) : null}
            {nav.trending ? (
              <Link href="/shop?collection=trending" className="hover:underline">
                Trending
              </Link>
            ) : null}
            {categories.map((category) => (
              <Link key={category.slug} href={`/shop?category=${category.slug}`} className="hover:underline">
                {category.name}
              </Link>
            ))}
            <Link href="/shop" className="hover:underline">
              All products
            </Link>
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Help</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/about" className="hover:underline">
              About and delivery
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <a href={generalWhatsApp} target="_blank" rel="noreferrer" className="hover:underline">
              WhatsApp
            </a>
            <Link href="/admin" className="text-brand-charcoal hover:underline">
              Admin
            </Link>
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">The shop</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a href={`tel:${brand.phoneTel}`} className="hover:underline">
              {brand.phoneDisplay}
            </a>
            <a href={`mailto:${brand.email}`} className="hover:underline">
              {brand.email}
            </a>
            <a href={brand.mapUrl} target="_blank" rel="noreferrer" className="text-brand-charcoal hover:underline">
              {brand.placeLine}
            </a>
            <p className="text-brand-charcoal">Prices in USD</p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden border-t border-brand-line px-5 md:px-10">
        <p className="font-display text-[16vw] uppercase leading-[0.8] tracking-[-0.03em] text-brand-black">Avenzo</p>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-5 py-5 text-[11px] uppercase tracking-[0.14em] text-brand-charcoal sm:flex-row sm:justify-between md:px-10">
        <p>© {new Date().getFullYear()} Avenzo. Tyre.</p>
        <p>Nationwide delivery</p>
      </div>
    </footer>
  );
}
