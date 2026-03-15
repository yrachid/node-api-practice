import { Kysely, PostgresDialect, type Generated } from "kysely";
import { Pool } from "pg";
import { Config } from "../config.js";

export interface Product {
  id: Generated<number>;
  name: string;
  price: number;
}

export interface Database {
  products: Product;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: Config.database.name,
    host: Config.database.host,
    user: Config.database.user,
    password: Config.database.password,
    port: Config.database.port,
    max: Config.database.poolSize,
  }),
});

export const db = new Kysely<Database>({ dialect });
