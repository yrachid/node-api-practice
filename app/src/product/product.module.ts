import type { Connection } from "../database.module";
import { ProductController } from "./product.controller";
import { Router } from "express";
import { ProductService } from "./product.service";

export type ProductModuleDependencies = {
  db: Connection;
};

function create({ db }: ProductModuleDependencies) {
  const service = new ProductService(db);
  const controller = ProductController.create(service);

  const router = Router();

  router.get("/products", controller.index);
  router.get("/products/:id", controller.get);
  router.post("/products", controller.create);

  return { router };
}

export const ProductModule = { create };
