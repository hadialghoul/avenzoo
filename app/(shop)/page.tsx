import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ShopNowButton } from "@/components/ShopNowButton";
import { brand, generalWhatsApp } from "@/lib/brand";
import { byNewest, isNewArrival } from "@/lib/catalog";
import { money } from "@/lib/format";
import { categoryName, readStoreAsync } from "@/lib/store";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "Avenzo · Menswear, Tyre" },
};

const lookOrder = ["camel-club-jacket", "azure-stripe-shirt", "stone-chino"];

export default async function HomePage() {
  const store = await readStoreAsync();
  const arrivals = store.products.filter((product) => isNewArrival(product)).sort(byNewest).slice(0, 8);
  const trending = store.products.filter((product) => product.featured);
  const offer = store.offers.find((item) => item.active);
  const outerwear = [...store.products].filter((product) => product.categoryId === "cat_outerwear").sort(byNewest)[0];
  const look = lookOrder
    .map((slug) => store.products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  return (
    <>
      <section className="relative bg-white">
        <div className="grid lg:min-h-[calc(100svh-6.4rem)] lg:grid-cols-12">
          <div className="relative min-h-[72vw] lg:col-span-7 lg:min-h-0">
            <img
              src="/images/avenzo-storefront.jpg"
              alt="Avenzo shopfront in Tyre"
              className="absolute inset-0 h-full w-full object-cover object-top lg:object-center"
            />
            <p className="absolute bottom-4 left-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white">The shop · Tyre</p>
          </div>
          <div className="flex flex-col justify-center px-5 py-12 motion-safe:animate-rise md:px-12 lg:col-span-5 lg:py-16 xl:pl-28">
            <span className="h-0.5 w-12 bg-brand-gold" />
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">Everyday menswear</p>
            <h1 className="mt-3 font-display text-[4.6rem] uppercase leading-[0.82] tracking-[-0.02em] sm:text-8xl xl:text-[6.6rem]">
              Built
              <span className="block">for every</span>
              <span className="block">day.</span>
            </h1>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-brand-charcoal">
              Shirts, trousers, jackets, and the pieces you actually wear. From Avenzo in Tyre, sent anywhere in Lebanon.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={store.nav.newArrival ? "/shop?collection=new" : "/shop"} className="btn-ink">
                {store.nav.newArrival ? "Shop new arrivals" : "Shop the collection"}
              </Link>
              <a href={generalWhatsApp} target="_blank" rel="noreferrer" className="btn-ghost">
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
        <img
          src="/images/p-denim.jpg"
          alt=""
          className="pointer-events-none absolute top-1/2 hidden h-72 w-48 -translate-y-1/2 border-[6px] border-white object-cover shadow-[0_16px_40px_rgba(0,0,0,0.18)] xl:block"
          style={{ left: "calc(58.333% - 8.5rem)" }}
        />
      </section>

      <section className="border-t border-brand-line">
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-5 pb-8 pt-16 md:px-10 md:pt-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">The floor</p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">Shop by category</h2>
          </div>
          <Link href="/shop" className="hidden text-[12px] font-semibold uppercase tracking-[0.16em] underline sm:inline">
            All products
          </Link>
        </div>
        <div>
          {store.categories.map((category, index) => {
            const count = store.products.filter((product) => product.categoryId === category.id).length;
            const flip = index % 2 === 1;
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group grid min-h-[460px] border-t border-brand-line lg:grid-cols-2 lg:min-h-[560px]"
              >
                <div className={`relative min-h-[320px] overflow-hidden bg-brand-mist ${flip ? "lg:order-2" : ""}`}>
                  <img
                    src={category.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover motion-safe:transition motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                  />
                </div>
                <div className="relative flex flex-col justify-between bg-brand-mist px-5 py-10 md:px-12 md:py-14">
                  <p className="font-display text-5xl text-brand-black/20">{String(index + 1).padStart(2, "0")}</p>
                  <div>
                    <h3 className="font-display text-6xl uppercase leading-none md:text-7xl">{category.name}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-charcoal">{category.description}</p>
                    <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em]">
                      {count} {count === 1 ? "piece" : "pieces"}
                      <span className="ml-3 inline-block transition group-hover:translate-x-1">→</span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {store.nav.newArrival ? (
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">Just in</p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">New arrivals</h2>
          </div>
          <Link href="/shop?collection=new" className="text-[12px] font-semibold uppercase tracking-[0.16em] underline">
            View all
          </Link>
        </div>
        {arrivals.length ? (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
            {arrivals.map((product) => (
              <ProductCard key={product.id} product={product} categoryName={categoryName(store, product.categoryId)} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-brand-charcoal">The collection is being prepared. Message us on WhatsApp in the meantime.</p>
        )}
      </section>
      ) : null}

      {store.nav.trending && trending.length ? (
        <section className="bg-brand-mist py-16 md:py-24">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-5 md:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">On rotation</p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">Trending</h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-charcoal">
                The pieces marked out from the current edit.
              </p>
            </div>
            <div className="flex snap-x gap-4 overflow-x-auto pb-2">
              {trending.map((product, index) => (
                <article key={product.id} className="w-[72vw] shrink-0 snap-start sm:w-72">
                  <Link href={`/product/${product.slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-white">
                      <span className="absolute left-3 top-2 z-10 font-display text-5xl text-white mix-blend-difference">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover motion-safe:transition motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                        />
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <h3 className="text-[15px] font-medium">{product.name}</h3>
                      <p className="text-sm">{money(product.price)}</p>
                    </div>
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
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {offer || outerwear ? (
        <section className="grid lg:grid-cols-12">
          <div className="order-2 flex flex-col justify-end bg-brand-black px-5 py-14 text-white md:px-14 lg:order-1 lg:col-span-5 lg:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">This week</p>
            {offer ? (
              <>
                <h2 className="mt-4 max-w-xl font-display text-5xl uppercase leading-[0.9] md:text-7xl">{offer.title}</h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">{offer.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/shop" className="btn-light">
                    Shop the edit
                  </Link>
                  <a href={generalWhatsApp} target="_blank" rel="noreferrer" className="btn-light-line">
                    Claim it on WhatsApp
                  </a>
                </div>
              </>
            ) : outerwear ? (
              <>
                <h2 className="mt-4 max-w-xl font-display text-5xl uppercase leading-[0.9] md:text-7xl">{outerwear.name}</h2>
                <p className="mt-5 text-2xl">{money(outerwear.price)}</p>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">{outerwear.description}</p>
                <Link href={`/product/${outerwear.slug}`} className="btn-light mt-8 w-fit">
                  View the piece
                </Link>
              </>
            ) : null}
          </div>
          <div className="relative order-1 min-h-[420px] lg:order-2 lg:col-span-7 lg:min-h-[720px]">
            <img
              src={offer ? "/images/p-coat2.jpg" : outerwear?.images[0] || "/images/p-coat2.jpg"}
              alt={offer ? "Campaign look" : outerwear?.name || ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </section>
      ) : null}

      {look.length >= 2 ? (
        <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-charcoal">Worn together</p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">Complete the look</h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-charcoal">
              A jacket, a shirt, and a trouser from the shop, ready to be ordered as one message.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {look.map((product, index) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-mist">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover motion-safe:transition motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 font-display text-4xl text-white">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-3 text-[15px] font-medium">{product.name}</p>
                <p className="text-sm text-brand-charcoal">{money(product.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-brand-black text-white">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">The drop</p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-[0.88] md:text-7xl">Hear it first.</h2>
          </div>
          <div>
            <p className="text-base leading-relaxed text-white/75">
              Message Avenzo on WhatsApp and we will tell you when a new piece lands in {brand.place}.
            </p>
            <a href={generalWhatsApp} target="_blank" rel="noreferrer" className="btn-light mt-6">
              Message {brand.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
