import { Router } from "express";
import type { Connection } from "../database.module";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

function create(db: Connection) {
  const service = new CartService(db);
  const controller = CartController.create(service);

  const router = Router();

  router.get("/carts/:id", controller.get);
  router.post("/carts", controller.create);

  return { router };
}

export const CartModule = { create };
