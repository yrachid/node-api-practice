import { expect, onTestFinished } from "vitest";
import { test } from "./e2e-context";

test("GET /carts/{id}", async ({ context }) => {
  const broomstickId = await context.factory.product({
    name: "Broomstick",
    price: 25.5,
    stock_count: 10,
  });

  const ladleId = await context.factory.product({
    name: "Ladle",
    price: 5.25,
    stock_count: 10,
  });

  const cartId = await context.factory.cart();

  await context.factory.cartProducts({
    cartId,
    products: [
      { id: broomstickId, count: 5 },
      { id: ladleId, count: 5 },
    ],
  });

  const response = await context.client.get(`/carts/${cartId}`);

  expect(response.status).toBe(200);
  expect(response.body.id).toBe(cartId);
  expect(response.body.products.length).toBe(2);
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

  onTestFinished(async () => {
    await context.factory.cleanup();
  });
});
