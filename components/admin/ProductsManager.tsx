"use client";

import { useEffect, useState } from "react";
import { isNewArrival } from "@/lib/catalog";
import { money } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

const empty = {
  name: "",
  price: "",
  categoryId: "",
  description: "",
  details: "",
  sizes: "S, M, L, XL",
  colors: "Black",
  featured: false,
  newArrival: true,
  inStock: true,
};

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const response = await fetch("/api/admin/products");
    if (response.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = (await response.json()) as { products: Product[]; categories: Category[] };
    setProducts(data.products);
    setCategories(data.categories);
    setForm((current) => ({ ...current, categoryId: current.categoryId || data.categories[0]?.id || "" }));
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function reset() {
    setForm({ ...empty, categoryId: categories[0]?.id || "" });
    setImages([]);
    setFiles([]);
    setEditing(null);
    setError("");
  }

  function edit(product: Product) {
    setEditing(product.id);
    setOpen(true);
    setImages(product.images);
    setFiles([]);
    setError("");
    setForm({
      name: product.name,
      price: String(product.price),
      categoryId: product.categoryId,
      description: product.description,
      details: product.details,
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      featured: product.featured,
      newArrival: isNewArrival(product),
      inStock: product.inStock,
    });
  }

  async function uploadFiles() {
    if (!files.length) return images;
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json()) as { urls?: string[]; error?: string };
    if (!response.ok || !data.urls) throw new Error(data.error || "The photo could not be uploaded.");
    return [...images, ...data.urls];
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const nextImages = await uploadFiles();
      const response = await fetch(editing ? `/api/admin/products/${editing}` : "/api/admin/products", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          images: nextImages,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save this piece.");
      reset();
      setOpen(false);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save this piece.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error || "Could not delete that piece.");
      return;
    }
    if (editing === product.id) {
      reset();
      setOpen(false);
    }
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Collection</p>
          <h1 className="mt-3 font-serif text-5xl">Products</h1>
        </div>
        <button
          type="button"
          className="btn-gold"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          Add a piece
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="mt-8 border border-gold/30 p-5 md:p-8">
          <h2 className="font-serif text-3xl">{editing ? "Edit piece" : "New piece"}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
              Name
              <input className="field mt-2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
              Price in USD
              <input className="field mt-2" type="number" min="1" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
              Category
              <select className="field mt-2" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
              Sizes, separated by commas
              <input className="field mt-2" value={form.sizes} onChange={(event) => setForm({ ...form, sizes: event.target.value })} />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-gold md:col-span-2">
              Colors the customer can choose, separated by commas
              <input className="field mt-2" value={form.colors} onChange={(event) => setForm({ ...form, colors: event.target.value })} />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-gold md:col-span-2">
              Description
              <textarea className="field mt-2 min-h-28" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-gold md:col-span-2">
              Details, separated by ·
              <input className="field mt-2" value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.inStock} onChange={(event) => setForm({ ...form, inStock: event.target.checked })} />
              Available to order
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.newArrival} onChange={(event) => setForm({ ...form, newArrival: event.target.checked })} />
              New arrival
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
              Trending
            </label>
          </div>
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-gold">Photos</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((src) => (
                <div key={src} className="relative">
                  <img src={src} alt="" className="h-24 w-20 object-cover" />
                  <button
                    type="button"
                    className="absolute right-1 top-1 bg-black/80 px-1 text-[10px] text-gold"
                    onClick={() => setImages(images.filter((item) => item !== src))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <input
              className="mt-4 block text-sm"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            />
            {files.length ? <p className="mt-2 text-xs text-mute">{files.map((file) => file.name).join(", ")}</p> : null}
          </div>
          {error ? <p className="mt-4 text-sm text-[#e7b4b4]">{error}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-gold" type="submit" disabled={busy}>
              {busy ? "Saving" : editing ? "Save changes" : "Add piece"}
            </button>
            <button
              className="btn-line"
              type="button"
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
        {loading ? (
          <p className="text-sm text-mute">Loading</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Piece</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="h-14 w-11 object-cover" />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{categories.find((category) => category.id === product.categoryId)?.name}</td>
                  <td>{money(product.price)}</td>
                  <td>{product.inStock ? "Available" : "Sold out"}</td>
                  <td className="space-x-3 text-right">
                    <button type="button" className="text-gold" onClick={() => edit(product)}>
                      Edit
                    </button>
                    <button type="button" className="text-[#e7b4b4]" onClick={() => remove(product)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
