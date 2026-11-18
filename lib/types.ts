export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  description: string;
  details: string;
  sizes: string[];
  colors: string[];
  images: string[];
  featured: boolean;
  newArrival?: boolean;
  inStock: boolean;
  createdAt: string;
};

export type NavSettings = {
  newArrival: boolean;
  trending: boolean;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  active: boolean;
  createdAt: string;
};

export type StoreData = {
  categories: Category[];
  products: Product[];
  offers: Offer[];
  nav: NavSettings;
};
