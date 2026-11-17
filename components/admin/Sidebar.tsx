"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/nav", label: "Navbar" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/orders", label: "Orders" },
];

export function Sidebar() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  function active(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const nav = links.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={`text-[11px] uppercase tracking-[0.18em] ${
        active(link.href) ? "text-gold" : "text-ivory/75 hover:text-gold"
      }`}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-gold/20 bg-black md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <span className="font-serif tracking-[0.22em]">AVENZO</span>
          <button type="button" onClick={logout} className="text-[11px] uppercase tracking-[0.16em] text-gold">
            Log out
          </button>
        </div>
        <div className="flex gap-5 overflow-x-auto px-4 pb-3">{nav}</div>
      </div>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gold/20 bg-black md:flex">
        <div className="border-b border-gold/20 px-6 py-8">
          <p className="font-serif text-3xl tracking-[0.18em]">AVENZO</p>
          <p className="mt-2 text-[10px] tracking-[0.32em] text-gold">ATELIER</p>
        </div>
        <nav className="flex flex-1 flex-col gap-5 px-6 py-8">{nav}</nav>
        <div className="flex flex-col gap-4 border-t border-gold/20 px-6 py-6">
          <Link href="/" className="text-[11px] uppercase tracking-[0.18em] text-mute hover:text-gold">
            View the shop
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-left text-[11px] uppercase tracking-[0.18em] text-gold"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
