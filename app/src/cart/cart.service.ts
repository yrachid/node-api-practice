import type { Connection } from "../database.module";

type CartProductRow = {
  cart_id: number;
  cart_created_at: Date;
  product_id: number;
  product_name: string;
  product_price: number;
  cart_stock_count: number;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  reservedCount: number;
};

export type Cart = {
  id: number;
  createdAt: Date;
  products: Array<{}>;
};

export class CartService {
  constructor(private readonly db: Connection) {}

  async findById(id: number): Promise<Cart> {
    const cartWithProducts = await this.db
      .selectFrom("carts_products")
      .innerJoin("products", "products.id", "carts_products.product_id")
      .innerJoin("carts", "carts.id", "carts_products.cart_id")
      .select([
        "carts_products.cart_id as cart_id",
        "carts.created_at as cart_created_at",
        "products.id as product_id",
        "products.name as product_name",
        "products.price as product_price",
        "carts_products.stock_count as cart_stock_count",
      ])
      .where("carts_products.cart_id", "=", id)
      .execute();

    const cart = this.mapResultSetToCart(cartWithProducts);

    return cart;
  }

  private mapResultSetToCart(queryResult: Array<CartProductRow>): Cart {
    return {
      id: queryResult[0]!.cart_id,
      createdAt: queryResult[0]!.cart_created_at,
      products: queryResult.map((cartProduct) => ({
        id: cartProduct.product_id,
        name: cartProduct.product_name,
        price: cartProduct.product_price,
        reservedCount: cartProduct.cart_stock_count,
      })),
    };
  }
}
