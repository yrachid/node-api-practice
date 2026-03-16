import { Kysely, PostgresDialect, type Generated } from "kysely";
import { Pool } from "pg";
import type { AppConfig } from "../config";

export interface Product {
  id: Generated<number>;
  name: string;
  price: number;
}

export interface Database {
  products: Product;
}

export type Connection = Kysely<Database>;

export const createConnection = (config: AppConfig): Connection => {
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

  return new Kysely<Database>({ dialect });
};
