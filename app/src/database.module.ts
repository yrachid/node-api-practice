import { Kysely, type LogEvent, PostgresDialect, type Generated } from "kysely";
import { Pool } from "pg";
import { Profile, type AppConfig } from "./configuration.module";
import { type ApplicationLogger } from "./logger.module";

export interface Product {
  id: Generated<number>;
  name: string;
  price: number;
  stock_count: number;
}

export interface Cart {
  id: Generated<number>;
  created_at: Date;
}

export interface CartProduct {
  cart_id: number;
  product_id: number;
  stock_count: number;
}

export interface Database {
  products: Product;
  carts: Cart;
  carts_products: CartProduct;
}

export type Connection = Kysely<Database>;

const SILENT_PROFILES: Array<Profile> = [Profile.PRODUCTION, Profile.TEST];

function createQueryLogger(config: AppConfig, logger: ApplicationLogger) {
  return (event: LogEvent): void => {
    if (SILENT_PROFILES.includes(config.profile)) {
      return;
    }

    const isError = event.level === "error";

    const extraDetails = isError ? { error: event.error } : {};

    const details = {
      sql: event.query.sql,
      parameters: event.query.parameters,
      durationMs: event.queryDurationMillis.toFixed(2),
      ...extraDetails,
    };

    isError
      ? logger.error({ event: "database.error", details })
      : logger.info({ event: "database.query", details });
  };
}

export function create(
  config: AppConfig,
  logger: ApplicationLogger,
): { connection: Connection } {
  const dialect = new PostgresDialect({
    pool: new Pool({
      database: config.database.name,
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      port: config.database.port,
      max: config.database.poolSize,
    }),
  });

  return {
    connection: new Kysely<Database>({
      dialect,
      log: createQueryLogger(config, logger),
    }),
  };
}

export const DatabaseModule = { create };
