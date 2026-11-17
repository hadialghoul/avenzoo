"use client";

import { useEffect, useState } from "react";
import type { Offer } from "@/lib/types";

const empty = { title: "", description: "", active: true };

export function OffersManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/offers");
    if (response.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = (await response.json()) as { offers: Offer[] };
    setOffers(data.offers);
  }

  useEffect(() => {
    void load();
  }, []);

  function reset() {
    setForm(empty);
    setEditing(null);
    setError("");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(editing ? `/api/admin/offers/${editing}` : "/api/admin/offers", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save this offer.");
      reset();
      setOpen(false);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save this offer.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(offer: Offer) {
    if (!window.confirm(`Delete “${offer.title}”?`)) return;
    const response = await fetch(`/api/admin/offers/${offer.id}`, { method: "DELETE" });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Could not delete that offer.");
      return;
    }
    if (editing === offer.id) {
      reset();
      setOpen(false);
    }
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">The house</p>
          <h1 className="mt-3 font-serif text-5xl">Offers</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">
            Anything marked “On the site” appears on the home page. Use it for a line such as Buy 2, get 1 free.
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
          Add an offer
        </button>
      </div>
      {open ? (
        <form onSubmit={onSubmit} className="mt-8 grid gap-5 border border-gold/30 p-5 md:p-8">
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Title
            <input
              className="field mt-2"
              value={form.title}
              placeholder="Buy 2, get 1 free"
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </label>
          <label className="block text-[11px] uppercase tracking-[0.16em] text-gold">
            Details
            <textarea
              className="field mt-2 min-h-28"
              value={form.description}
              placeholder="Choose any three pieces. The lowest price is on the house."
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />
          </label>
          <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-gold">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm({ ...form, active: event.target.checked })}
            />
            On the site
          </label>
          {error ? <p className="text-sm text-[#e7b4b4]">{error}</p> : null}
          <div className="flex gap-3">
            <button className="btn-gold" disabled={busy}>
              {busy ? "Saving" : editing ? "Save changes" : "Add offer"}
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
      <div className="mt-10 grid gap-4">
        {offers.map((offer) => (
          <article key={offer.id} className="border border-white/10 p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{offer.active ? "On the site" : "Hidden"}</p>
                <h2 className="mt-2 font-serif text-3xl">{offer.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">{offer.description}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <button
                  type="button"
                  className="text-gold"
                  onClick={() => {
                    setEditing(offer.id);
                    setForm({ title: offer.title, description: offer.description, active: offer.active });
                    setOpen(true);
                    setError("");
                  }}
                >
                  Edit
                </button>
                <button type="button" className="text-[#e7b4b4]" onClick={() => remove(offer)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {offers.length === 0 ? <p className="text-sm text-mute">No offers yet. Add one and it will show on the home page.</p> : null}
      </div>
    </div>
  );
}
