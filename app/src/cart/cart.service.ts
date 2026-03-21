import type { Connection } from "../database.module";

export type Product = {
  id: number;
  name: string;
  price: number;
  reservedCount: number;
};

export type Cart = {
  id: number;
  createdAt: Date;
  products: Array<Product>;
};

export class CartService {
  constructor(private readonly db: Connection) {}

  async findById(id: number): Promise<Cart> {
    const cart = await this.db
      .selectFrom("carts")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();

    const products = await this.db
      .selectFrom("carts_products")
      .innerJoin("products", "products.id", "carts_products.product_id")
      .select([
        "products.id as id",
        "products.name as name",
        "products.price as price",
        "carts_products.stock_count as reserved_stock_count",
      ])
      .where("carts_products.cart_id", "=", cart.id)
      .execute();

    return {
      id: cart.id,
      createdAt: cart.created_at,
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        reservedCount: product.reserved_stock_count,
      })),
    };
  }
}
