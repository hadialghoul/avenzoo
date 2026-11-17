import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getSession } from "@/lib/auth";
import { formatDate, money } from "@/lib/format";
import { readStoreAsync } from "@/lib/store";

export default async function DashboardPage() {
  const session = await getSession();
  const store = await readStoreAsync();
  const openOrders = store.orders.filter((order) => order.status !== "delivered" && order.status !== "cancelled");
  const value = store.orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const recent = [...store.orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6);
  const stats = [
    { label: "Pieces", value: String(store.products.length) },
    { label: "Categories", value: String(store.categories.length) },
    { label: "Orders", value: String(store.orders.length) },
    { label: "Open orders", value: String(openOrders.length) },
    { label: "Order value", value: money(value) },
  ];

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Dashboard</p>
      <h1 className="mt-3 font-serif text-5xl">Atelier</h1>
      <p className="mt-3 text-sm text-mute">Signed in as {session?.email}. The three sample orders can be edited or deleted.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
        <Link href="/admin/orders" className="btn-line">
          Add an order
        </Link>
      </div>
      <div className="mt-12 overflow-x-auto">
        <h2 className="font-serif text-3xl">Recent orders</h2>
        <table className="admin-table mt-4">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>City</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((order) => (
              <tr key={order.id}>
                <td>{order.number}</td>
                <td>{order.customerName}</td>
                <td>{order.city}</td>
                <td>{money(order.total)}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
