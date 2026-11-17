import Link from "next/link";
import { ShopNowButton } from "@/components/ShopNowButton";
import { isNewArrival } from "@/lib/catalog";
import { colorSwatch } from "@/lib/color";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, categoryName }: { product: Product; categoryName: string }) {
  const second = product.images[1];
  const fresh = isNewArrival(product);

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-mist">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className={`h-full w-full object-cover motion-safe:transition motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.04] ${
                second ? "motion-safe:group-hover:opacity-0" : ""
              }`}
            />
          ) : null}
          {second ? (
            <img
              src={second}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-0 motion-safe:transition motion-safe:duration-700 motion-safe:group-hover:opacity-100"
            />
          ) : null}
          <div className="absolute left-3 top-3 flex gap-2">
            {fresh && product.inStock ? (
              <span className="bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">New</span>
            ) : null}
            {product.inStock ? null : (
              <span className="bg-brand-black px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                Sold out
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-brand-charcoal">{categoryName}</p>
            <h3 className="mt-1 text-[15px] font-medium leading-snug">{product.name}</h3>
          </div>
          <p className="shrink-0 text-sm">{money(product.price)}</p>
        </div>
        {product.colors.length ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <li key={color} className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-brand-charcoal">
                <span className="h-2.5 w-2.5 border border-black/15" style={{ backgroundColor: colorSwatch(color) }} />
                {color}
              </li>
            ))}
          </ul>
        ) : null}
        {product.sizes.length ? (
          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-brand-charcoal">{product.sizes.join("  ")}</p>
        ) : null}
      </Link>
      <ShopNowButton
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0] || "",
          sizes: product.sizes,
          colors: product.colors,
          inStock: product.inStock,
        }}
      />
    </article>
  );
}
