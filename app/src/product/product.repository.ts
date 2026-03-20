import type { Connection } from "../database.module";

export abstract class ProductRepository {
  abstract findAll(): Promise<
    Array<{ id: number; name: string; price: number }>
  >;
}

export type Product = { id: number; name: string; price: number };

export class ProductRepositoryStub extends ProductRepository {
  #products: Array<Product> = [];

  constructor() {
    super();
  }

  init(products: Array<Product>) {
    for (const product of products) {
      this.#products.push(product);
    }
  }

  findAll(): Promise<Array<Product>> {
    return Promise.resolve(this.#products);
  }
}

export class ProductRepositoryDb extends ProductRepository {
  constructor(private readonly db: Connection) {
    super();
  }

  async findAll(): Promise<Array<{ id: number; name: string; price: number }>> {
    const products = await this.db.selectFrom("products").selectAll().execute();

    return products;
  }
}
