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

export type ProductReservation = {
  products: Array<{ id: number; count: number }>;
};

export class CartService {
  constructor(private readonly db: Connection) {}

  async findById(id: number): Promise<Cart | undefined> {
    const cart = await this.db
      .selectFrom("carts")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!cart) {
      return undefined;
    }

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

  async create(reservation: ProductReservation) {
    const cart = await this.db.transaction().execute(async (tx) => {
      const products = reservation.products.sort((a, b) => a.id - b.id);

      for (const product of products) {
        const affected = await tx
          .updateTable("products")
          .set((expression) => ({
            stock_count: expression("stock_count", "-", product.count),
          }))
          .where("products.id", "=", product.id)
          .where("products.stock_count", ">=", product.count)
          .executeTakeFirstOrThrow();

        if (Number(affected.numUpdatedRows) === 0) {
          throw new Error(`Unavailable stock for product: ${product.id}`);
        }
      }

      const cart = await tx
        .insertInto("carts")
        .values({
          created_at: new Date(),
        })
        .returning(["id", "created_at"])
        .executeTakeFirstOrThrow();

      await tx
        .insertInto("carts_products")
        .values(
          reservation.products.map((product) => ({
            cart_id: cart.id,
            product_id: product.id,
            stock_count: product.count,
          })),
        )
        .executeTakeFirstOrThrow();

      return {
        id: cart.id,
        createdAt: cart.created_at,
        products: reservation.products,
      };
    });

    return cart;
  }
}
