import { expect, onTestFinished } from "vitest";
import { test } from "./e2e-context";

test("GET /products", async ({ context }) => {
  const broomId = await context.factory.product({
    name: "Broomstick",
    price: 25.5,
    stock_count: 10,
  });

  const toyId = await context.factory.product({
    name: "Dog Toy",
    price: 35,
    stock_count: 10,
  });

  const response = await context.client.get("/products");

  expect(response.status).toBe(200);
  expect(response.body.count).toBe(2);
  expect(response.body.data).toContainEqual({
    id: broomId,
    name: "Broomstick",
    price: "25.50",
    stockCount: "10",
  });
  expect(response.body.data).toContainEqual({
    id: toyId,
    name: "Dog Toy",
    price: "35.00",
    stockCount: "10",
  });

  onTestFinished(async () => await context.factory.cleanup());
});
