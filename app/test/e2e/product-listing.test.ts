import { expect } from "vitest";
import { test } from "./e2e-context";
import request from "supertest";

test.beforeEach(async ({ context }) => {
  await context.connection
    .insertInto("products")
    .values({
      name: "Broomstick",
      price: 25.5,
    })
    .execute();

  return async function cleanup() {
    await context.connection.deleteFrom("products").execute();
  };
});

test("Product Listing", async ({ context }) => {
  const response = await request(context.app).get("/products");

  expect(response.status).toBe(200);
  expect(response.body.count).toBe(1);
  expect(response.body.data[0].name).toBe("Broomstick");
  expect(response.body.data[0].price).toBe("25.50");
});
