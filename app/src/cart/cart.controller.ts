import type { Request, Response } from "express";
import type { CartService } from "./cart.service";

const controllerFactory = (service: CartService) => ({
  async get(req: Request, res: Response) {
    // TODO: Request schema validation (including params)
    const cart = await service.findById(req.params.id as unknown as number);

    return res.json(cart);
  },
});

export const CartController = { create: controllerFactory };
