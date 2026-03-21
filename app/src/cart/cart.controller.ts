import type { Request, Response } from "express";
import type { CartService } from "./cart.service";

const controllerFactory = (service: CartService) => ({
  async get(req: Request, res: Response) {
    // TODO: Request schema validation (including params)
    const cart = await service.findById(req.params.id as unknown as number);

    if (!cart) {
      return res.status(404).json({
        message: `Cart not found: ${req.params.id}`,
      });
    }

    return res.json(cart);
  },

  async create(req: Request, res: Response) {
    try {
      const cart = await service.create({
        products: req.body.products,
      });
      return res.status(201).json(cart);
    } catch (error) {
      return res.status(422).send();
    }
  },
});

export const CartController = { create: controllerFactory };
