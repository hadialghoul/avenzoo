"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

const empty = { name: "", description: "", image: "" };

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/categories");
    if (response.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = (await response.json()) as { categories: Category[] };
    setCategories(data.categories);
  }

  useEffect(() => {
    void load();
  }, []);

  function reset() {
    setForm(empty);
    setFile(null);
    setEditing(null);
    setError("");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      let image = form.image;
      if (file) {
        const body = new FormData();
        body.append("files", file);
        const uploaded = await fetch("/api/admin/upload", { method: "POST", body });
        const data = (await uploaded.json()) as { urls?: string[]; error?: string };
        if (!uploaded.ok || !data.urls?.[0]) throw new Error(data.error || "The photo could not be uploaded.");
        image = data.urls[0];
      }
      const response = await fetch(editing ? `/api/admin/categories/${editing}` : "/api/admin/categories", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save this category.");
      reset();
      setOpen(false);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save this category.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(category: Category) {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    const response = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Could not delete that category.");
      return;
    }
    if (editing === category.id) {
      reset();
      setOpen(false);
    }
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Rooms</p>
          <h1 className="mt-3 font-serif text-5xl">Categories</h1>
        </div>
        <button
          type="button"
          className="btn-gold"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          Add a category
        </button>
      </div>
      {open ? (
        <form onSubmit={onSubmit} className="mt-8 grid gap-5 border border-gold/30 p-5 md:grid-cols-2 md:p-8">
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Name
            <input className="field mt-2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Description
            <input className="field mt-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <div className="md:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-gold">Photo</p>
            {form.image ? <img src={form.image} alt="" className="mt-3 h-28 w-24 object-cover" /> : null}
            <input className="mt-3 block text-sm" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </div>
          {error ? <p className="text-sm text-[#e7b4b4] md:col-span-2">{error}</p> : null}
          <div className="flex gap-3 md:col-span-2">
            <button className="btn-gold" disabled={busy}>
              {busy ? "Saving" : editing ? "Save changes" : "Add category"}
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
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="border border-white/10">
            <img src={category.image} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <h2 className="font-serif text-2xl">{category.name}</h2>
              <p className="mt-2 text-sm text-mute">{category.description}</p>
              <div className="mt-4 flex gap-4 text-sm">
                <button
                  type="button"
                  className="text-gold"
                  onClick={() => {
                    setEditing(category.id);
                    setForm({ name: category.name, description: category.description, image: category.image });
                    setFile(null);
                    setOpen(true);
                    setError("");
                  }}
                >
                  Edit
                </button>
                <button type="button" className="text-[#e7b4b4]" onClick={() => remove(category)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
