import express, { type Express } from "express";
import {
  ConfigurationModule,
  type AppConfig,
  type Env,
} from "./configuration.module";
import { ProductModule } from "./product/product.module";
import { HealthCheckModule } from "./health-check/health-check.module";
import { DatabaseModule, type Connection } from "./database.module";

export type ApplicationContext = {
  app: Express;
  configuration: AppConfig;
  connection: Connection;
};

export function create(env: Env): ApplicationContext {
  const app = express();

  const configuration = ConfigurationModule.create(env);

  const databaseModule = DatabaseModule.create(configuration);

  const healthCheckModule = HealthCheckModule.create();

  const productModule = ProductModule.create({
    db: databaseModule.connection,
  });

  app.use(productModule.router);
  app.use(healthCheckModule.router);

  return { app, configuration, connection: databaseModule.connection };
}

export const ApplicationModule = { create };
