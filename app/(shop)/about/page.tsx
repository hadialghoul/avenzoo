import type { Metadata } from "next";
import Link from "next/link";
import { deliveryCities, generalWhatsApp } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: "Avenzo is everyday menswear in Tyre (Sour), South Lebanon. Order on WhatsApp. We deliver across Lebanon.",
};

const steps = [
  {
    title: "Choose the piece",
    copy: "Open a product, pick the size and color, then press Shop now.",
  },
  {
    title: "Checkout is a chat",
    copy: "Shop now writes one WhatsApp message with the photo, size, color, and price of the piece you selected.",
  },
  {
    title: "We deliver",
    copy: "From Tyre to Sidon, Beirut, Tripoli, Zahle, and the towns in between. If your area is quiet on the map, tell us anyway.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">Avenzo · Tyre</p>
        <h1 className="mt-4 max-w-5xl font-display text-5xl uppercase leading-[0.88] md:text-8xl">
          Menswear from Tyre, ordered like a conversation.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-brand-charcoal">
          You see a piece. You open it. You send it to us on WhatsApp — the photo, the link, the size — and a person at
          Avenzo answers. We confirm it, then we deliver it anywhere in Lebanon.
        </p>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px] bg-brand-mist lg:min-h-[680px]">
          <img src="/images/story.jpg" alt="Man in a brown leather jacket" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center px-5 py-14 md:px-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">How an order works</p>
          <ol className="mt-8 space-y-8">
            {steps.map((step, index) => (
              <li key={step.title}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-display text-4xl uppercase leading-none">{step.title}</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-charcoal">{step.copy}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-ink">
              Shop the edit
            </Link>
            <a href={generalWhatsApp} target="_blank" rel="noreferrer" className="btn-ghost">
              Message Avenzo
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-brand-line">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">Delivery</p>
          <h2 className="mt-3 font-display text-5xl uppercase md:text-6xl">All over Lebanon</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-5">
            {deliveryCities.map((city) => (
              <p key={city} className="border-t border-brand-line pt-3 text-sm">
                {city}
              </p>
            ))}
          </div>
          <p className="mt-8 max-w-xl text-sm text-brand-charcoal">
            These are the cities we deliver to every week. If yours is not listed, we still come. The day and the fee are
            agreed on WhatsApp before we send the piece.
          </p>
        </div>
      </section>
    </div>
  );
}
