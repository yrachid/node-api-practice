import type { Request, Response } from "express";
import { ProductService } from "./product.service.js";

export const ProductController = {
  index: async (_: Request, res: Response) => {
    const products = await ProductService.all();

    res.json({
      data: products,
      count: products.length,
    });
  },
};
