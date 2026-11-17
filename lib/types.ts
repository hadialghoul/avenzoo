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

export type OrderItem = {
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
};

export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  number: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: OrderItem[];
  status: OrderStatus;
  notes: string;
  total: number;
  createdAt: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  active: boolean;
  createdAt: string;
};

export type StoreData = {
  orderSeq: number;
  categories: Category[];
  products: Product[];
  orders: Order[];
  offers: Offer[];
  nav: NavSettings;
};
