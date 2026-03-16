import { suite, test, expect } from "vitest";
import { ProductServiceImpl } from "./product.service.js";
import { ProductRepositoryStub } from "./product.repository.js";

suite("ProductService", () => {
  test("#all", async () => {
    const repo = new ProductRepositoryStub();

    repo.init([
      {
        id: 1,
        name: "Broomstick",
        price: 25.5,
      },
    ]);

    const service = new ProductServiceImpl(repo);

    expect(await service.all()).toStrictEqual([
      {
        id: 1,
        name: "Broomstick",
        price: 25.5,
      },
    ]);
  });
});
