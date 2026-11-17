import Link from "next/link";

export default function ShopNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-28 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">Avenzo</p>
      <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] md:text-7xl">This piece is not in the shop.</h1>
      <Link href="/shop" className="btn-ink mt-8">
        Back to the shop
      </Link>
    </div>
  );
}
