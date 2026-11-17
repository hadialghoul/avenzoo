"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { orderCities } from "@/lib/brand";
import { formatDate, money, orderStatuses } from "@/lib/format";
import type { Order, OrderStatus, Product } from "@/lib/types";

const empty = {
  customerName: "",
  phone: "",
  city: "Tyre",
  address: "",
  productId: "",
  size: "",
  color: "",
  quantity: "1",
  status: "new" as OrderStatus,
  notes: "",
};

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/orders");
    if (response.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = (await response.json()) as { orders: Order[]; products: Product[] };
    setOrders(data.orders);
    setProducts(data.products);
    setForm((current) => ({ ...current, productId: current.productId || data.products[0]?.id || "" }));
  }

  useEffect(() => {
    void load();
  }, []);

  const selected = products.find((product) => product.id === form.productId);
  const preview = selected ? selected.price * Number(form.quantity || 0) : 0;

  function reset() {
    setForm({ ...empty, productId: products[0]?.id || "" });
    setEditing(null);
    setError("");
  }

  function edit(order: Order) {
    const item = order.items[0];
    setEditing(order.id);
    setOpen(true);
    setError("");
    setForm({
      customerName: order.customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      productId: item?.productId || products[0]?.id || "",
      size: item?.size || "",
      color: item?.color || "",
      quantity: String(item?.quantity || 1),
      status: order.status,
      notes: order.notes,
    });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch(editing ? `/api/admin/orders/${editing}` : "/api/admin/orders", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
    });
    const data = (await response.json()) as { error?: string };
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Could not save this order.");
      return;
    }
    reset();
    setOpen(false);
    await load();
  }

  async function remove(order: Order) {
    if (!window.confirm(`Delete order ${order.number}?`)) return;
    const response = await fetch(`/api/admin/orders/${order.id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error || "Could not delete that order.");
      return;
    }
    if (editing === order.id) {
      reset();
      setOpen(false);
    }
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Desk</p>
          <h1 className="mt-3 font-serif text-5xl">Orders</h1>
          <p className="mt-3 max-w-xl text-sm text-mute">
            Customers buy on WhatsApp. When a sale is agreed, record it here and follow it through delivery.
          </p>
        </div>
        <button
          type="button"
          className="btn-gold"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          Add an order
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="mt-8 grid gap-5 border border-gold/30 p-5 md:grid-cols-2 md:p-8">
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Customer
            <input className="field mt-2" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} required />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Phone
            <input className="field mt-2" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            City
            <select className="field mt-2" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })}>
              {orderCities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Status
            <select className="field mt-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as OrderStatus })}>
              {orderStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold md:col-span-2">
            Address
            <input className="field mt-2" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Piece
            <select className="field mt-2" value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Quantity
            <input className="field mt-2" type="number" min="1" max="20" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Size
            <input className="field mt-2" value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value })} />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Color
            <input className="field mt-2" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold md:col-span-2">
            Notes
            <textarea className="field mt-2 min-h-24" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </label>
          <p className="text-sm text-gold md:col-span-2">Total {money(Number.isFinite(preview) ? preview : 0)}</p>
          {error ? <p className="text-sm text-[#e7b4b4] md:col-span-2">{error}</p> : null}
          <div className="flex gap-3 md:col-span-2">
            <button className="btn-gold" disabled={busy}>
              {busy ? "Saving" : editing ? "Save order" : "Add order"}
            </button>
            <button
              type="button"
              className="btn-line"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {error && !open ? <p className="mt-6 text-sm text-[#e7b4b4]">{error}</p> : null}

      <div className="mt-10 overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Piece</th>
              <th>City</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.number}</td>
                <td>
                  <p>{order.customerName}</p>
                  <p className="text-xs text-mute">{order.phone}</p>
                </td>
                <td>
                  {order.items[0]?.productName}
                  <p className="text-xs text-mute">
                    {[order.items[0]?.size, order.items[0]?.color, order.items[0] ? `× ${order.items[0].quantity}` : ""]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </td>
                <td>{order.city}</td>
                <td>{money(order.total)}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td className="space-x-3 text-right">
                  <button type="button" className="text-gold" onClick={() => edit(order)}>
                    Edit
                  </button>
                  <button type="button" className="text-[#e7b4b4]" onClick={() => remove(order)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
