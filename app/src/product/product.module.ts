import type { Connection } from "../database/connection";
import { ProductController } from "./product.controller";
import { ProductRepositoryDb } from "./product.repository";
import { ProductServiceImpl } from "./product.service";
import { Router } from "express";

const createModule = (dependencies: { db: Connection }) => {
  const repository = new ProductRepositoryDb(dependencies.db);
  const service = new ProductServiceImpl(repository);
  const controller = ProductController.create(service);

  const router = Router();

  router.get("/products", controller.index);

  return { router };
};

export const ProductModule = { create: createModule };
