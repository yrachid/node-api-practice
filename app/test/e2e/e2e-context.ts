import { test as baseTest } from "vitest";
import { ApplicationModule } from "../../src/application.module";
import request from "supertest";
import { Insertable } from "kysely";
import { Product } from "../../src/database.module";

const TEST_ENV = {
  NODE_ENV: "test",
  DATABASE_HOST: "localhost",
  DATABASE_NAME: "stockroom_test",
  DATABASE_PASSWORD: "postgres",
  DATABASE_POOL_SIZE: "1",
  DATABASE_PORT: "5433",
  DATABASE_USER: "postgres",
  PORT: "3002",
};

export const test = baseTest.extend("context", () => {
  const appContext = ApplicationModule.create(TEST_ENV);

  const factory = {
    async product(insert: Insertable<Product>) {
      const newProduct = await appContext.connection
        .insertInto("products")
        .values(insert)
        .returning("id")
        .executeTakeFirstOrThrow();

      return newProduct.id;
    },

    async cart() {
      const newCart = await appContext.connection
        .insertInto("carts")
        .values({
          created_at: new Date(),
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      return newCart.id;
    },

    async cartProducts(data: {
      cartId: number;
      products: Array<{ id: number; count: number }>;
    }) {
      const insert = data.products.map((product) => ({
        cart_id: data.cartId,
        product_id: product.id,
        stock_count: product.count,
      }));

      await appContext.connection
        .insertInto("carts_products")
        .values(insert)
        .executeTakeFirstOrThrow();
    },

    async cleanup() {
      await appContext.connection.deleteFrom("carts_products").execute();
      await appContext.connection.deleteFrom("carts").execute();
      await appContext.connection.deleteFrom("products").execute();
    },
  };

  return {
    connection: appContext.connection,
    client: request(appContext.app),
    factory,
  };
});
