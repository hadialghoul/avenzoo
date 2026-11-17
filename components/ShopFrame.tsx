import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { readStoreAsync } from "@/lib/store";

export async function ShopFrame({ children }: { children: React.ReactNode }) {
  const store = await readStoreAsync();
  const categories = store.categories.map((category) => ({ name: category.name, slug: category.slug }));
  const offers = store.offers.filter((offer) => offer.active).map((offer) => ({ id: offer.id, title: offer.title }));

  return (
    <div className="shop-shell min-h-screen overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-brand-black focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header categories={categories} offers={offers} nav={store.nav} />
      <main id="main">{children}</main>
      <Footer categories={categories} nav={store.nav} />
    </div>
  );
}
