import type { Express } from "express";
import { HealthController } from "./health/health.controller.js";
import { ProductController } from "./product/product.controller.js";

export const Routes = {
  register: (app: Express) => {
    app.get("/health", HealthController.index);
    app.get("/products", ProductController.index);
  },
};
