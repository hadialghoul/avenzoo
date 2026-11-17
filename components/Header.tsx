"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brand, generalWhatsApp } from "@/lib/brand";
import type { NavSettings } from "@/lib/types";

type NavCategory = { name: string; slug: string };
type LiveOffer = { id: string; title: string };

export function Header({
  categories,
  offers,
  nav,
}: {
  categories: NavCategory[];
  offers: LiveOffer[];
  nav: NavSettings;
}) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategories, setMobileCategories] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
    setCategoriesOpen(false);
    setMobileCategories(false);
    setQuery(window.location.search);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenu(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  useEffect(() => {
    if (!categoriesOpen) return;
    function onDoc(event: MouseEvent) {
      if (!categoriesRef.current?.contains(event.target as Node)) setCategoriesOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setCategoriesOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [categoriesOpen]);

  const params = new URLSearchParams(query);
  const activeCategory = pathname === "/shop" ? params.get("category") || "" : "";
  const activeCollection = pathname === "/shop" ? params.get("collection") || "" : "";
  const offer = offers[0]?.title;

  const textLinks = [
    { href: "/", label: "Home", active: pathname === "/" },
    ...(nav.newArrival
      ? [{ href: "/shop?collection=new", label: "New Arrival", active: activeCollection === "new" && !activeCategory }]
      : []),
    ...(nav.trending
      ? [{ href: "/shop?collection=trending", label: "Trending", active: activeCollection === "trending" && !activeCategory }]
      : []),
  ];

  const shopActive = pathname === "/shop" && !activeCategory && activeCollection !== "new" && activeCollection !== "trending";

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="flex h-9 items-center justify-between gap-3 bg-brand-black px-4 text-[10px] uppercase tracking-[0.16em] text-white sm:px-6 sm:text-[11px]">
        <p className="flex min-w-0 items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 bg-brand-gold" />
          <span className="truncate">{offer || "Everyday menswear from Tyre"}</span>
        </p>
        <p className="hidden text-white/75 md:block">Delivered across Lebanon</p>
        <a href={`tel:${brand.phoneTel}`} className="shrink-0 text-white/80 hover:text-white">
          {brand.phoneDisplay}
        </a>
      </div>
      <div className="flex h-16 items-center gap-3 border-b border-brand-line px-4 md:px-6">
        <button
          type="button"
          className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.16em] xl:hidden"
          aria-expanded={menu}
          aria-label={menu ? "Close menu" : "Open menu"}
          onClick={() => setMenu(true)}
        >
          Menu
        </button>
        <Link href="/" aria-label="Avenzo" className="flex shrink-0 items-center">
          <img src="/images/Avenzo-logo.JPG" alt="" className="h-14 w-14 object-cover" />
        </Link>
        <nav className="ml-3 hidden min-w-0 flex-1 items-center gap-5 xl:flex">
          {textLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.active)}>
              <span className={link.active ? "border-b-2 border-brand-gold pb-1" : ""}>{link.label}</span>
            </Link>
          ))}
          {categories.length ? (
            <div ref={categoriesRef} className="relative">
              <button
                type="button"
                className={linkClass(Boolean(activeCategory))}
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
                onClick={() => setCategoriesOpen((open) => !open)}
              >
                <span className={activeCategory ? "border-b-2 border-brand-gold pb-1" : ""}>
                  Categories
                  <span className="ml-1 text-[10px]" aria-hidden="true">
                    ▾
                  </span>
                </span>
              </button>
              {categoriesOpen ? (
                <div className="absolute left-0 top-full z-50 pt-3">
                  <div className="min-w-52 border border-brand-line bg-white py-2 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                    {categories.map((category) => {
                      const active = activeCategory === category.slug;
                      return (
                        <Link
                          key={category.slug}
                          href={`/shop?category=${category.slug}`}
                          className={`block px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] ${
                            active ? "bg-brand-mist text-brand-black" : "text-brand-charcoal hover:bg-brand-mist hover:text-brand-black"
                          }`}
                        >
                          {category.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          <Link href="/shop" className={linkClass(shopActive)}>
            <span className={shopActive ? "border-b-2 border-brand-gold pb-1" : ""}>Shop</span>
          </Link>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="text-[12px] font-semibold uppercase tracking-[0.14em]"
            aria-expanded={search}
            onClick={() => setSearch((open) => !open)}
          >
            Search
          </button>
          <a
            href={generalWhatsApp}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] font-semibold uppercase tracking-[0.14em]"
          >
            WhatsApp
          </a>
        </div>
      </div>
      {search ? (
        <form action="/shop" className="border-b border-brand-line bg-brand-mist">
          <input
            name="q"
            autoFocus
            placeholder="Search shirts, jackets, trousers"
            className="w-full bg-transparent px-5 py-4 text-base outline-none placeholder:text-brand-charcoal/50 md:px-6"
          />
        </form>
      ) : null}
      <div
        aria-hidden={!menu}
        inert={!menu}
        className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white px-6 pb-8 pt-6 transition-transform duration-300 motion-reduce:transition-none xl:hidden ${
          menu ? "translate-x-0" : "pointer-events-none -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <img src="/images/Avenzo-logo.JPG" alt="Avenzo" className="h-16 w-16 object-cover" />
          <button type="button" className="text-[12px] font-semibold uppercase tracking-[0.16em]" onClick={() => setMenu(false)}>
            Close
          </button>
        </div>
        <form action="/shop" className="mt-8 border-b border-brand-black">
          <input
            name="q"
            placeholder="Search the shop"
            className="w-full bg-transparent py-3 text-base outline-none placeholder:text-brand-charcoal/50"
          />
        </form>
        <nav className="mt-8 flex flex-col gap-2">
          {textLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-display text-5xl uppercase leading-[1.05] tracking-wide">
              {link.label}
            </Link>
          ))}
          {categories.length ? (
            <div>
              <button
                type="button"
                className="flex w-full items-baseline justify-between font-display text-5xl uppercase leading-[1.05] tracking-wide"
                aria-expanded={mobileCategories}
                onClick={() => setMobileCategories((open) => !open)}
              >
                Categories
                <span className="text-3xl">{mobileCategories ? "−" : "+"}</span>
              </button>
              {mobileCategories ? (
                <div className="mt-3 flex flex-col gap-2 pl-1">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/shop?category=${category.slug}`}
                      className="text-2xl uppercase tracking-[0.08em]"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          <Link href="/shop" className="font-display text-5xl uppercase leading-[1.05] tracking-wide">
            Shop
          </Link>
        </nav>
        <a href={generalWhatsApp} target="_blank" rel="noreferrer" className="btn-ink mt-10">
          Order on WhatsApp
        </a>
      </div>
    </header>
  );
}

function linkClass(active: boolean) {
  return `shrink-0 text-[12px] font-semibold uppercase tracking-[0.14em] ${
    active ? "text-brand-black" : "text-brand-charcoal/80 hover:text-brand-black"
  }`;
}
