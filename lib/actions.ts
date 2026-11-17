import { cleanImages, cleanList, cleanText, isOrderStatus, slugify } from "./format";
import { uid, updateStore } from "./store";
import type { Category, NavSettings, Offer, Order, Product } from "./types";

function uniqueSlug(items: { id: string; slug: string }[], name: string, selfId?: string) {
  const base = slugify(name);
  let slug = base;
  let count = 2;
  while (items.some((item) => item.slug === slug && item.id !== selfId)) {
    slug = `${base}-${count}`;
    count += 1;
  }
  return slug;
}

function productInput(body: Record<string, unknown>, categories: { id: string }[]) {
  const name = cleanText(body.name, 80);
  const categoryId = cleanText(body.categoryId, 80);
  const price = Math.round(Number(body.price) * 100) / 100;
  const images = cleanImages(body.images);
  if (!name) throw new Error("Add a name for this piece.");
  if (!categories.some((category) => category.id === categoryId)) throw new Error("Choose a category.");
  if (!Number.isFinite(price) || price <= 0) throw new Error("Add a price above zero.");
  if (!images.length) throw new Error("Add at least one photo.");
  return {
    name,
    categoryId,
    price,
    description: cleanText(body.description, 1200),
    details: cleanText(body.details, 600),
    sizes: cleanList(body.sizes),
    colors: cleanList(body.colors),
    images,
    featured: Boolean(body.featured),
    newArrival: Boolean(body.newArrival),
    inStock: Boolean(body.inStock),
  };
}

export function createProduct(body: Record<string, unknown>) {
  return updateStore((store) => {
    const input = productInput(body, store.categories);
    const product: Product = {
      id: uid(),
      slug: uniqueSlug(store.products, input.name),
      createdAt: new Date().toISOString(),
      ...input,
    };
    store.products.unshift(product);
    return product;
  });
}

export function updateProduct(id: string, body: Record<string, unknown>) {
  return updateStore((store) => {
    const index = store.products.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("That piece no longer exists.");
    const input = productInput(body, store.categories);
    const current = store.products[index];
    const product: Product = {
      ...current,
      ...input,
      slug: uniqueSlug(store.products, input.name, id),
    };
    store.products[index] = product;
    return product;
  });
}

export function deleteProduct(id: string) {
  return updateStore((store) => {
    const before = store.products.length;
    store.products = store.products.filter((item) => item.id !== id);
    if (store.products.length === before) throw new Error("That piece no longer exists.");
    return { ok: true };
  });
}

function categoryInput(body: Record<string, unknown>) {
  const name = cleanText(body.name, 40);
  const image = cleanImages([body.image])[0] || "";
  if (!name) throw new Error("Add a category name.");
  if (!image) throw new Error("Add a category photo.");
  return {
    name,
    description: cleanText(body.description, 240),
    image,
  };
}

export function createCategory(body: Record<string, unknown>) {
  return updateStore((store) => {
    const input = categoryInput(body);
    const category: Category = {
      id: uid(),
      slug: uniqueSlug(store.categories, input.name),
      ...input,
    };
    store.categories.push(category);
    return category;
  });
}

export function updateCategory(id: string, body: Record<string, unknown>) {
  return updateStore((store) => {
    const index = store.categories.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("That category no longer exists.");
    const input = categoryInput(body);
    const category: Category = {
      ...store.categories[index],
      ...input,
      slug: uniqueSlug(store.categories, input.name, id),
    };
    store.categories[index] = category;
    return category;
  });
}

export function deleteCategory(id: string) {
  return updateStore((store) => {
    if (store.products.some((product) => product.categoryId === id)) {
      throw new Error("Move or delete the pieces in this category first.");
    }
    const before = store.categories.length;
    store.categories = store.categories.filter((item) => item.id !== id);
    if (store.categories.length === before) throw new Error("That category no longer exists.");
    return { ok: true };
  });
}

function orderInput(body: Record<string, unknown>, products: Product[], previousPrice?: number) {
  const customerName = cleanText(body.customerName, 80);
  const phone = cleanText(body.phone, 40);
  const city = cleanText(body.city, 40);
  const address = cleanText(body.address, 240);
  const productId = cleanText(body.productId, 80);
  const quantity = Math.round(Number(body.quantity));
  const status = cleanText(body.status, 40);
  const product = products.find((item) => item.id === productId);
  if (!customerName) throw new Error("Add the customer name.");
  if (!phone) throw new Error("Add a phone number.");
  if (!city) throw new Error("Choose a city.");
  if (!address) throw new Error("Add the delivery address.");
  if (!product) throw new Error("Choose a piece from the collection.");
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
    throw new Error("Quantity must be between 1 and 20.");
  }
  if (!isOrderStatus(status)) throw new Error("Choose an order status.");
  const price = previousPrice ?? product.price;
  return {
    customerName,
    phone,
    city,
    address,
    notes: cleanText(body.notes, 800),
    status,
    items: [
      {
        productId: product.id,
        productName: product.name,
        size: cleanText(body.size, 24),
        color: cleanText(body.color, 24),
        quantity,
        price,
      },
    ],
    total: Math.round(price * quantity * 100) / 100,
  };
}

export function createOrder(body: Record<string, unknown>) {
  return updateStore((store) => {
    const input = orderInput(body, store.products);
    store.orderSeq += 1;
    const order: Order = {
      id: uid(),
      number: `AV-${store.orderSeq}`,
      customerName: input.customerName,
      phone: input.phone,
      city: input.city,
      address: input.address,
      notes: input.notes,
      status: input.status,
      items: input.items,
      total: input.total,
      createdAt: new Date().toISOString(),
    };
    store.orders.unshift(order);
    return order;
  });
}

export function updateOrder(id: string, body: Record<string, unknown>) {
  return updateStore((store) => {
    const index = store.orders.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("That order no longer exists.");
    const current = store.orders[index];
    const samePiece = current.items[0]?.productId === cleanText(body.productId, 80);
    const input = orderInput(body, store.products, samePiece ? current.items[0]?.price : undefined);
    const order: Order = {
      ...current,
      customerName: input.customerName,
      phone: input.phone,
      city: input.city,
      address: input.address,
      notes: input.notes,
      status: input.status,
      items: input.items,
      total: input.total,
    };
    store.orders[index] = order;
    return order;
  });
}

function offerInput(body: Record<string, unknown>) {
  const title = cleanText(body.title, 80);
  const description = cleanText(body.description, 500);
  if (!title) throw new Error("Add a title for this offer.");
  if (!description) throw new Error("Say what the offer includes.");
  return {
    title,
    description,
    active: Boolean(body.active),
  };
}

export function createOffer(body: Record<string, unknown>) {
  return updateStore((store) => {
    const input = offerInput(body);
    const offer: Offer = {
      id: uid(),
      createdAt: new Date().toISOString(),
      ...input,
    };
    store.offers.unshift(offer);
    return offer;
  });
}

export function updateOffer(id: string, body: Record<string, unknown>) {
  return updateStore((store) => {
    const index = store.offers.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("That offer no longer exists.");
    const offer: Offer = {
      ...store.offers[index],
      ...offerInput(body),
    };
    store.offers[index] = offer;
    return offer;
  });
}

export function updateNav(body: Record<string, unknown>) {
  return updateStore((store) => {
    const nav: NavSettings = {
      newArrival: Boolean(body.newArrival),
      trending: Boolean(body.trending),
    };
    store.nav = nav;
    return nav;
  });
}

export function deleteOffer(id: string) {
  return updateStore((store) => {
    const before = store.offers.length;
    store.offers = store.offers.filter((item) => item.id !== id);
    if (store.offers.length === before) throw new Error("That offer no longer exists.");
    return { ok: true };
  });
}

export function deleteOrder(id: string) {
  return updateStore((store) => {
    const before = store.orders.length;
    store.orders = store.orders.filter((item) => item.id !== id);
    if (store.orders.length === before) throw new Error("That order no longer exists.");
    return { ok: true };
  });
}
