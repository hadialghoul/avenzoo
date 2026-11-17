"use client";

import { useEffect, useState } from "react";
import type { NavSettings } from "@/lib/types";

const fallback: NavSettings = { newArrival: true, trending: true };

export function NavManager() {
  const [nav, setNav] = useState<NavSettings>(fallback);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/admin/nav");
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await response.json()) as { nav?: NavSettings };
      if (data.nav) setNav(data.nav);
      setLoading(false);
    })();
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch("/api/admin/nav", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nav),
      });
      const data = (await response.json()) as NavSettings & { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save the menu.");
      setNav({ newArrival: data.newArrival, trending: data.trending });
      setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save the menu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Shop menu</p>
      <h1 className="mt-3 font-serif text-5xl">Navbar</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">
        Turn New Arrival and Trending on or off in the menu. Categories always open as a dropdown. Mark each piece from
        Products.
      </p>
      {loading ? (
        <p className="mt-8 text-sm text-mute">Loading</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 max-w-xl border border-gold/30 p-5 md:p-8">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={nav.newArrival}
              onChange={(event) => setNav({ ...nav, newArrival: event.target.checked })}
            />
            <span>
              <span className="block uppercase tracking-[0.14em] text-gold">New Arrival</span>
              <span className="mt-1 block text-mute">Shows the New Arrival link. Pieces marked New arrival appear there.</span>
            </span>
          </label>
          <label className="mt-6 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={nav.trending}
              onChange={(event) => setNav({ ...nav, trending: event.target.checked })}
            />
            <span>
              <span className="block uppercase tracking-[0.14em] text-gold">Trending</span>
              <span className="mt-1 block text-mute">Shows the Trending link. Pieces marked Trending appear there.</span>
            </span>
          </label>
          {error ? <p className="mt-5 text-sm text-[#e7b4b4]">{error}</p> : null}
          {saved ? <p className="mt-5 text-sm text-gold">Saved. The shop menu updates immediately.</p> : null}
          <button className="btn-gold mt-6" type="submit" disabled={busy}>
            {busy ? "Saving" : "Save menu"}
          </button>
        </form>
      )}
    </div>
  );
}
