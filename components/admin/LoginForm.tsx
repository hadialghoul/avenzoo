"use client";

import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Email or password is not correct.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden min-h-screen lg:block">
        <img src="/images/story.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-6 border border-gold/40" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Tyre · Sour</p>
          <p className="mt-3 font-serif text-6xl tracking-[0.08em]">Avenzo</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-16">
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Atelier access</p>
          <h1 className="mt-4 font-serif text-5xl">Sign in</h1>
          <p className="mt-4 text-sm leading-relaxed text-mute">
            This door is for the house. Add pieces, offers, and the orders you confirm on WhatsApp.
          </p>
          <label className="mt-8 block text-[11px] uppercase tracking-[0.18em] text-gold">
            Email
            <input
              className="field mt-2"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="mt-5 block text-[11px] uppercase tracking-[0.18em] text-gold">
            Password
            <input
              className="field mt-2"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="mt-4 text-sm text-[#e7b4b4]">{error}</p> : null}
          <button className="btn-gold mt-8 w-full" type="submit" disabled={busy}>
            {busy ? "Opening" : "Enter the atelier"}
          </button>
        </form>
      </section>
    </main>
  );
}
