import { expect } from "vitest";
import { test } from "./e2e-context";

let broomstickId: number;
let ladleId: number;

test.beforeEach(async ({ context }) => {
  broomstickId = await context.factory.product({
    name: "Broomstick",
    price: 25.5,
    stock_count: 10,
  });

  ladleId = await context.factory.product({
    name: "Ladle",
    price: 5.25,
    stock_count: 10,
  });

  return async () => await context.factory.cleanup();
});

test("POST /carts: successful", async ({ context }) => {
  const response = await context.client.post("/carts").send({
    products: [
      {
        id: ladleId,
        count: 5,
      },
      {
        id: broomstickId,
        count: 6,
      },
    ],
  });

  expect(response.status).toBe(201);
  expect(response.body.products).toContainEqual({
    id: ladleId,
    count: 5,
  });
  expect(response.body.products).toContainEqual({
    id: broomstickId,
    count: 6,
  });
});

test("POST /carts: invalid product", async ({ context }) => {
  const response = await context.client.post("/carts").send({
    products: [
      {
        id: 0,
        count: 5,
      },
      {
        id: broomstickId,
        count: 6,
      },
    ],
  });

  expect(response.status).toBe(422);
});

test("POST /carts: insufficient stock", async ({ context }) => {
  const response = await context.client.post("/carts").send({
    products: [
      {
        id: ladleId,
        count: 25,
      },
    ],
  });

  expect(response.status).toBe(422);
});
