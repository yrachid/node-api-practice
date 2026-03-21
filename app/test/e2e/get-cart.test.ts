import { expect } from "vitest";
import { test } from "./e2e-context";
import request from "supertest";

let cartId: number;
let broomstickId: number;
let ladleId: number;

test.beforeEach(async ({ context }) => {
  broomstickId = (
    await context.connection
      .insertInto("products")
      .values({
        name: "Broomstick",
        price: 25.5,
        stock_count: 10,
      })
      .returning("id")
      .executeTakeFirstOrThrow()
  ).id;

  ladleId = (
    await context.connection
      .insertInto("products")
      .values({
        name: "Ladle",
        price: 5.25,
        stock_count: 10,
      })
      .returning("id")
      .executeTakeFirstOrThrow()
  ).id;

  cartId = (
    await context.connection
      .insertInto("carts")
      .values({
        created_at: new Date(),
      })
      .returning("id")
      .executeTakeFirstOrThrow()
  ).id;

  await context.connection
    .insertInto("carts_products")
    .values({
      cart_id: cartId,
      product_id: broomstickId,
      stock_count: 5,
    })
    .executeTakeFirstOrThrow();

  await context.connection
    .insertInto("carts_products")
    .values({
      cart_id: cartId,
      product_id: ladleId,
      stock_count: 5,
    })
    .executeTakeFirstOrThrow();

  return async function cleanup() {
    await context.connection.deleteFrom("carts_products").execute();
    await context.connection.deleteFrom("carts").execute();
    await context.connection.deleteFrom("products").execute();
  };
});

test("GET /carts/{id}", async ({ context }) => {
  const response = await request(context.app).get(`/carts/${cartId}`);

  expect(response.status).toBe(200);
  expect(response.body.id).toBe(cartId);
  expect(response.body.products).toContainEqual({
    id: broomstickId,
    name: "Broomstick",
    price: "25.50",
    reservedCount: 5,
  });
  expect(response.body.products).toContainEqual({
    id: ladleId,
    name: "Ladle",
    price: "5.25",
    reservedCount: 5,
  });
});
