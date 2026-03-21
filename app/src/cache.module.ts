import { createCache, type Cache } from "cache-manager";
import type { Product } from "./cart/cart.service";

export class CacheStore<V> {
  constructor(
    public readonly name: string,
    private readonly store: Cache,
  ) {}

  async set(key: string, value: V): Promise<V> {
    return await this.store.set(key, value);
  }

  async get(key: string): Promise<V | undefined> {
    return await this.store.get(key);
  }

  async remove(key: string): Promise<boolean> {
    return await this.store.del(key);
  }

  async clear(): Promise<boolean> {
    return await this.store.clear();
  }
}

function create() {
  return {
    product: new CacheStore<Exclude<Product, "reservedCount">>(
      "products",
      createCache(),
    ),
    stockCount: new CacheStore<number>("product_stock_count", createCache()),
  };
}

export const CacheModule = { create };
