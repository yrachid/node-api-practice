import { suite, test, expect } from "vitest";
import { ProductService } from "./product.service.js";

suite("ProductService", () => {
  test("#all", async () => {
    const allProducts = await ProductService.all();

    expect(allProducts).toStrictEqual([
      {
        id: 1,
        name: "Broomstick",
        price: "25.50",
      },
    ]);
  });
});
