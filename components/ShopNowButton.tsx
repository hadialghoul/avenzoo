"use client";

import { useState } from "react";
import { orderWhatsApp } from "@/lib/bag";
import { colorSwatch } from "@/lib/color";

type QuickProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
};

export function ShopNowButton({ product }: { product: QuickProduct }) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [color, setColor] = useState(product.colors.length === 1 ? product.colors[0] : "");
  const [error, setError] = useState("");
  const needsChoice = product.sizes.length > 1 || product.colors.length > 1;
  const label = product.inStock ? "Shop now" : "Ask on WhatsApp";

  function send(nextSize = size, nextColor = color) {
    if (product.sizes.length > 0 && !nextSize) {
      setError("Choose a size.");
      setOpen(true);
      return;
    }
    if (product.colors.length > 0 && !nextColor) {
      setError("Choose a color.");
      setOpen(true);
      return;
    }
    const href = orderWhatsApp(
      [
        {
          id: "single",
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          size: nextSize,
          color: nextColor,
          quantity: 1,
        },
      ],
      window.location.origin,
    );
    const opened = window.open(href, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = href;
    setError("");
    setOpen(false);
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        className="text-[12px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4 hover:text-brand-charcoal"
        onClick={() => (needsChoice ? setOpen((value) => !value) : send())}
      >
        {label}
      </button>
      {open ? (
        <div className="mt-3 border border-brand-line bg-brand-mist p-3">
          {product.sizes.length > 1 ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-brand-charcoal">Size</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSize(item);
                      setError("");
                    }}
                    className={`min-w-10 border px-2.5 py-1.5 text-sm ${
                      size === item ? "border-brand-black bg-brand-black text-white" : "border-brand-line bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {product.colors.length > 0 ? (
            <div className={product.sizes.length > 1 ? "mt-3" : ""}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-brand-charcoal">Color</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.colors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setColor(item);
                      setError("");
                    }}
                    className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-sm ${
                      color === item ? "border-brand-black bg-brand-black text-white" : "border-brand-line bg-white"
                    }`}
                  >
                    <span
                      className="h-3 w-3 border border-black/15"
                      style={{ backgroundColor: colorSwatch(item) }}
                      aria-hidden="true"
                    />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {error ? <p className="mt-3 text-sm">{error}</p> : null}
          <button type="button" className="btn-ink mt-3 w-full" onClick={() => send()}>
            {label}
          </button>
        </div>
      ) : null}
    </div>
  );
}
