import { randomUUID } from "crypto";
import { promises as fs, readFileSync } from "fs";
import path from "path";
import type { StoreData } from "./types";

const dataPath = path.join(process.cwd(), "data", "store.json");

function normalize(store: StoreData) {
  if (!Array.isArray(store.offers)) store.offers = [];
  const nav = store.nav;
  store.nav = {
    newArrival: nav?.newArrival !== false,
    trending: nav?.trending !== false,
  };
  return store;
}

let queue: Promise<unknown> = Promise.resolve();

export function readStore(): StoreData {
  const raw = readFileSync(dataPath, "utf8");
  return normalize(JSON.parse(raw) as StoreData);
}

export function updateStore<T>(mutator: (store: StoreData) => T): Promise<T> {
  const run = queue.then(async () => {
    const raw = await fs.readFile(dataPath, "utf8");
    const store = normalize(JSON.parse(raw) as StoreData);
    const result = mutator(store);
    await fs.writeFile(dataPath, JSON.stringify(store, null, 2));
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function uid() {
  return randomUUID();
}

export function categoryName(store: StoreData, categoryId: string) {
  return store.categories.find((category) => category.id === categoryId)?.name ?? "";
}
