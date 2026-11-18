import Link from "next/link";
import { getSession } from "@/lib/auth";
import { readStoreAsync } from "@/lib/store";

export default async function DashboardPage() {
  const session = await getSession();
  const store = await readStoreAsync();
  const stats = [
    { label: "Pieces", value: String(store.products.length) },
    { label: "Categories", value: String(store.categories.length) },
    { label: "Offers", value: String(store.offers.length) },
  ];

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Dashboard</p>
      <h1 className="mt-3 font-serif text-5xl">Atelier</h1>
      <p className="mt-3 text-sm text-mute">Signed in as {session?.email}.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="border border-gold/25 px-4 py-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold">{stat.label}</p>
            <p className="mt-3 font-serif text-3xl">{stat.value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products" className="btn-gold">
          Add a piece
        </Link>
        <Link href="/admin/offers" className="btn-line">
          Edit offers
        </Link>
      </div>
    </div>
  );
}
