import type { Connection } from "../database.module";

export type Product = {
  id: number;
  name: string;
  price: number;
  stockCount: number;
};

export class ProductService {
  constructor(private readonly db: Connection) {}

  async findById(id: number): Promise<Product | undefined> {
    const product = await this.db
      .selectFrom("products")
      .where("id", "=", id)
      .select(["id", "name", "price", "stock_count"])
      .selectAll()
      .executeTakeFirst();

    if (!product) {
      return undefined;
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stockCount: product.stock_count,
    };
  }

  async findAll(): Promise<Array<Product>> {
    const products = await this.db.selectFrom("products").selectAll().execute();

    return products.map((productRow) => ({
      id: productRow.id,
      name: productRow.name,
      price: productRow.price,
      stockCount: productRow.stock_count,
    }));
  }

  async create(product: Omit<Product, "id">) {
    const result = await this.db
      .insertInto("products")
      .values({
        name: product.name,
        price: product.price,
        stock_count: product.stockCount,
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    return Promise.resolve({ id: result.id, ...product });
  }
}
