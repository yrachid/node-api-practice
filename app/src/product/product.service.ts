import type { Product, ProductRepository } from "./product.repository";

export abstract class ProductService {
  abstract all(): Promise<Array<Product>>;
}

export class ProductServiceImpl extends ProductService {
  constructor(private readonly repo: ProductRepository) {
    super();
  }

  async all() {
    return await this.repo.findAll();
  }
}
