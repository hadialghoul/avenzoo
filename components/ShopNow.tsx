"use client";

import { useEffect, useState } from "react";
import { orderWhatsApp } from "@/lib/bag";
import { brand } from "@/lib/brand";
import { colorSwatch } from "@/lib/color";

type Piece = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
};

export function ShopNow({ product }: { product: Piece }) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [guide, setGuide] = useState(false);

  useEffect(() => {
    setSize(product.sizes.length === 1 ? product.sizes[0] : "");
    setColor(product.colors.length === 1 ? product.colors[0] : "");
    setQuantity(1);
    setError("");
  }, [product]);

  function chosen() {
    if (product.sizes.length > 0 && !size) {
      setError("Choose a size first.");
      return null;
    }
    if (product.colors.length > 0 && !color) {
      setError("Choose a color first.");
      return null;
    }
    setError("");
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      size,
      color,
      quantity,
    };
  }

  function sendOne() {
    const draft = chosen();
    if (!draft) return;
    const href = orderWhatsApp(
      [{ ...draft, id: "single", quantity }],
      window.location.origin,
    );
    const opened = window.open(href, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = href;
  }

  return (
    <div className="mt-8 border-t border-brand-line pt-8">
      {product.sizes.length > 0 ? (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Size</p>
            <button type="button" className="text-[12px] underline" onClick={() => setGuide((open) => !open)}>
              Size guide
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSize(item);
                  setError("");
                }}
                className={`min-w-12 border px-3 py-2 text-sm transition ${
                  size === item ? "border-brand-black bg-brand-black text-white" : "border-brand-line hover:border-brand-black"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {guide ? (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-charcoal">
              Choose the size you usually wear. Letter sizes run from S to XXL. Trouser sizes are the waist. If you are
              between sizes, message us on WhatsApp and we will confirm the fit before the piece leaves Tyre.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-brand-charcoal">One size.</p>
      )}

      {product.colors.length > 0 ? (
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Color</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colors.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setColor(item);
                  setError("");
                }}
                className={`inline-flex items-center gap-2 border px-3 py-2 text-sm transition ${
                  color === item ? "border-brand-black bg-brand-black text-white" : "border-brand-line hover:border-brand-black"
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

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Quantity</p>
        <div className="mt-3 inline-flex border border-brand-line">
          <button type="button" className="px-4 py-2" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
            −
          </button>
          <span className="grid min-w-10 place-items-center text-sm">{quantity}</span>
          <button type="button" className="px-4 py-2" onClick={() => setQuantity((value) => Math.min(5, value + 1))} aria-label="Increase quantity">
            +
          </button>
        </div>
      </div>

      {error ? <p className="mt-5 text-sm">{error}</p> : null}
      {!product.inStock ? <p className="mt-5 text-sm text-brand-charcoal">This piece is sold out. Ask us when it returns.</p> : null}

      <div className="mt-6">
        <button type="button" onClick={sendOne} className="btn-ink">
          {product.inStock ? "Shop now" : "Ask on WhatsApp"}
        </button>
      </div>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-charcoal">
        Shop now opens WhatsApp with Avenzo on {brand.phoneDisplay}. The message includes this piece, the photo, the
        size, the color, and the price. We reply personally and arrange delivery anywhere in Lebanon.
      </p>
    </div>
  );
}
