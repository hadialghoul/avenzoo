import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeliveryNote } from "@/components/DeliveryNote";
import { Gallery } from "@/components/Gallery";
import { ProductCard } from "@/components/ProductCard";
import { ShopNow } from "@/components/ShopNow";
import { money } from "@/lib/format";
import { categoryName, readStoreAsync } from "@/lib/store";

type Context = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Context): Promise<Metadata> {
  const { slug } = await params;
  const store = await readStoreAsync();
  const product = store.products.find((item) => item.slug === slug);
  if (!product) return { title: "Piece" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: Context) {
  const { slug } = await params;
  const store = await readStoreAsync();
  const product = store.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const category = store.categories.find((item) => item.id === product.categoryId);
  const related = store.products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 3);
  const details = product.details
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div>
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-8 md:px-10 md:py-12 lg:grid-cols-2 lg:gap-16">
        <Gallery images={product.images} name={product.name} />
        <div>
          <nav className="text-[12px] uppercase tracking-[0.14em] text-brand-charcoal">
            <Link href="/shop" className="hover:text-brand-text">
              Shop
            </Link>
            {category ? (
              <>
                <span className="px-2">/</span>
                <Link href={`/shop?category=${category.slug}`} className="hover:text-brand-text">
                  {category.name}
                </Link>
              </>
            ) : null}
          </nav>
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-charcoal">{category?.name ?? "Avenzo"}</p>
          <h1 className="mt-3 font-display text-5xl uppercase leading-[0.9] md:text-7xl">{product.name}</h1>
          <p className="mt-5 text-2xl">{money(product.price)}</p>
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em]">
            {product.inStock ? "In stock" : "Sold out"}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-charcoal">{product.description}</p>
          {details.length ? (
            <ul className="mt-6 space-y-2 text-sm">
              {details.map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span className="mt-[0.55rem] h-1 w-1 shrink-0 bg-brand-gold" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <ShopNow
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              images: product.images,
              sizes: product.sizes,
              colors: product.colors,
              inStock: product.inStock,
            }}
          />
          <DeliveryNote />
        </div>
      </div>

      {related.length ? (
        <section className="mx-auto mt-4 max-w-[1600px] border-t border-brand-line px-5 py-14 md:px-10">
          <h2 className="font-display text-5xl uppercase">More in {category?.name || "the shop"}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} categoryName={categoryName(store, item.categoryId)} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
