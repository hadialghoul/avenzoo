import { randomUUID } from "crypto";
import type { StoreData } from "./types";
import initialStoreData from "../data/store.json";

const STORE_KEY = "avenzo:store";

function isRedisEnabled() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL);
}

let redisClient: import("@upstash/redis").Redis | null = null;

async function getRedis() {
  if (!redisClient && isRedisEnabled()) {
    const { Redis } = await import("@upstash/redis");
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redisClient;
}

function normalize(store: StoreData) {
  if (!Array.isArray(store.offers)) store.offers = [];
  const nav = store.nav;
  store.nav = {
    newArrival: nav?.newArrival !== false,
    trending: nav?.trending !== false,
  };
  return store;
}

function getInitialData(): StoreData {
  return normalize(initialStoreData as StoreData);
}

async function getLocalStore(): Promise<{ fs: typeof import("fs/promises"); path: string }> {
  const fs = await import("fs/promises");
  const path = await import("path");
  return { fs, path: path.join(process.cwd(), "data", "store.json") };
}

let queue: Promise<unknown> = Promise.resolve();

export function readStore(): StoreData {
  if (isRedisEnabled()) {
    throw new Error("Use readStoreAsync() when Redis is enabled");
  }
  const fs = require("fs");
  const path = require("path");
  const dataPath = path.join(process.cwd(), "data", "store.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  return normalize(JSON.parse(raw) as StoreData);
}

export async function readStoreAsync(): Promise<StoreData> {
  if (isRedisEnabled()) {
    const redis = await getRedis();
    const data = await redis!.get<StoreData>(STORE_KEY);
    if (data) {
      return normalize(data);
    }
    const initial = getInitialData();
    await redis!.set(STORE_KEY, initial);
    return initial;
  }
  const { fs, path } = await getLocalStore();
  const raw = await fs.readFile(path, "utf8");
  return normalize(JSON.parse(raw) as StoreData);
}

export function updateStore<T>(mutator: (store: StoreData) => T): Promise<T> {
  const run = queue.then(async () => {
    if (isRedisEnabled()) {
      const redis = await getRedis();
      const data = await redis!.get<StoreData>(STORE_KEY);
      const store = data ? normalize(data) : getInitialData();
      const result = mutator(store);
      await redis!.set(STORE_KEY, store);
      return result;
    }
    const { fs, path } = await getLocalStore();
    const raw = await fs.readFile(path, "utf8");
    const store = normalize(JSON.parse(raw) as StoreData);
    const result = mutator(store);
    await fs.writeFile(path, JSON.stringify(store, null, 2));
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function seedStore(): Promise<void> {
  if (!isRedisEnabled()) {
    throw new Error("Seeding is only needed for Redis storage");
  }
  const redis = await getRedis();
  const initial = getInitialData();
  await redis!.set(STORE_KEY, initial);
}

export function uid() {
  return randomUUID();
}

export function categoryName(store: StoreData, categoryId: string) {
  return store.categories.find((category) => category.id === categoryId)?.name ?? "";
}
