import { test, expect } from "vitest";
import { buildApplicationServer } from "../../src/server.js";
import request from "supertest";

test("Product Listing", async () => {
  const app = buildApplicationServer();

  const response = await request(app).get("/products");

  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual({
    count: 1,
    data: [
      {
        id: 1,
        name: "Broomstick",
        price: "25.50",
      },
    ],
  });
});
