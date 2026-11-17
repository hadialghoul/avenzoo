import type { Metadata } from "next";
import { brand, deliveryCities, generalWhatsApp } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description: "Message Avenzo on WhatsApp. Everyday menswear from Tyre (Sour), delivered across Lebanon.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-2">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">Contact</p>
        <h1 className="mt-4 font-display text-6xl uppercase leading-[0.86] md:text-8xl">Talk to Avenzo.</h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-brand-charcoal">
          Orders, sizing, and delivery happen on WhatsApp. Send the piece you want, or just say where you are in Lebanon.
        </p>
        <a href={generalWhatsApp} target="_blank" rel="noreferrer" className="btn-ink mt-8">
          WhatsApp {brand.phoneDisplay}
        </a>
        <dl className="mt-14 space-y-8 border-t border-brand-line pt-8">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em]">Phone</dt>
            <dd className="mt-2 font-display text-4xl uppercase md:text-5xl">
              <a href={`tel:${brand.phoneTel}`} className="hover:text-brand-charcoal">
                {brand.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em]">Email</dt>
            <dd className="mt-2 text-2xl">
              <a href={`mailto:${brand.email}`} className="hover:underline">
                {brand.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em]">Location</dt>
            <dd className="mt-2 font-display text-4xl uppercase">
              <a href={brand.mapUrl} target="_blank" rel="noreferrer" className="hover:text-brand-charcoal">
                {brand.placeLine}
              </a>
            </dd>
            <a
              href={brand.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-brand-charcoal underline"
            >
              Open in Google Maps
            </a>
          </div>
        </dl>
      </div>
      <div className="bg-brand-black p-8 text-white md:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">We deliver to</p>
        <div className="mt-8 grid grid-cols-2 gap-y-4">
          {deliveryCities.map((city) => (
            <p key={city} className="font-display text-3xl uppercase">
              {city}
            </p>
          ))}
        </div>
        <p className="mt-10 max-w-sm text-sm leading-relaxed text-white/70">
          And the towns around them. Tell us the area on WhatsApp and we will confirm the delivery.
        </p>
      </div>
    </div>
  );
}
