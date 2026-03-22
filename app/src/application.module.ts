import express, { type Express } from "express";
import bodyParser from "body-parser";
import {
  ConfigurationModule,
  type AppConfig,
  type Env,
} from "./configuration.module";
import { ProductModule } from "./product/product.module";
import { HealthCheckModule } from "./health-check/health-check.module";
import { DatabaseModule, type Connection } from "./database.module";
import { type ApplicationLogger, LoggerModule } from "./logger.module";
import { CartModule } from "./cart/cart.module";
import { CartExpirationQueue } from "./cart/cart-expiration.queue";

export type ApplicationContext = {
  app: Express;
  configuration: AppConfig;
  connection: Connection;
  logger: ApplicationLogger;
};

export function create(env: Env): ApplicationContext {
  const app = express();

  const configuration = ConfigurationModule.create(env);

  const loggerModule = LoggerModule.create(configuration.profile);

  const databaseModule = DatabaseModule.create(
    configuration,
    loggerModule.logger,
  );

  const healthCheckModule = HealthCheckModule.create();

  const productModule = ProductModule.create({
    db: databaseModule.connection,
  });

  const cartModule = CartModule.create(databaseModule.connection);

  const cartExpirationQueue = CartExpirationQueue.create(
    configuration,
    loggerModule.logger,
    databaseModule.connection,
  );

  cartExpirationQueue.schedule().then(() =>
    loggerModule.logger.info({
      event: "cart_expiration.queue.register.success",
    }),
  );

  app.use(bodyParser.json());
  app.use(loggerModule.httpMiddleware);
  app.use(productModule.router);
  app.use(cartModule.router);
  app.use(healthCheckModule.router);

  return {
    app,
    configuration,
    connection: databaseModule.connection,
    logger: loggerModule.logger,
  };
}

export const ApplicationModule = { create };
