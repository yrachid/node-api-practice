import express from "express";
import type { Express } from "express";
import { loadAppConfig } from "./config";
import { createConnection } from "./database/connection";
import { ProductModule } from "./product/product.module";
import { HealthCheckModule } from "./health-check/health-check.module";

export const buildApplicationServer = (): Express => {
  const app = express();

  const configuration = loadAppConfig();
  const databaseConnection = createConnection(configuration);

  const healthCheckModule = HealthCheckModule.create();

  const productModule = ProductModule.create({
    db: databaseConnection,
  });

  app.use(productModule.router);
  app.use(healthCheckModule.router);

  return app;
};
