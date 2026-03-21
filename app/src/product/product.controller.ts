import type { Request, Response } from "express";
import type { ProductService } from "./product.service";

const createController = (service: ProductService) => {
  async function index(_: Request, res: Response) {
    const products = await service.findAll();

    return res.json({
      data: products,
      count: products.length,
    });
  }

  async function get(req: Request, res: Response) {
    const product = await service.findById(req.params.id as unknown as number);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    return res.json(product);
  }

  async function create(req: Request, res: Response) {
    const product = await service.create({
      name: req.body.name,
      price: req.body.price,
      stockCount: req.body.stockCount,
    });

    return res.status(201).json(product);
  }

  return { index, get, create };
};

export const ProductController = { create: createController };
