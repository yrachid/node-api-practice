import express from "express";
import type { Express } from "express";
import { ProductService } from "./product.service.js";

export const buildApplicationServer = (): Express => {
  const app = express();

  app.get("/health", (_, res) => {
    res.json({
      ok: true,
    });
  });

  app.get("/products", async (_, res) => {
    const products = await ProductService.all();

    res.json({
      data: products,
      count: products.length,
    });
  });

  return app;
};
