import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("products")
    .addColumn("stock_count", "bigint", (col) => col.notNull().defaultTo(0))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("products").dropColumn("stock_count").execute();
}
