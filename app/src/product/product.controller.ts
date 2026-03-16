import type { Request, Response } from "express";
import { ProductService } from "./product.service.js";

const create = (service: ProductService) => {
  async function index(_: Request, res: Response) {
    const products = await service.all();

    return res.json({
      data: products,
      count: products.length,
    });
  }

  return { index };
};

export const ProductController = { create };
