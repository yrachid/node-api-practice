import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("carts")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("carts_products")
    .addColumn("product_id", "bigint")
    .addColumn("cart_id", "bigint")
    .addColumn("stock_count", "integer", (col) => col.notNull())
    .addPrimaryKeyConstraint("carts_products_pkey", ["cart_id", "product_id"])
    .addForeignKeyConstraint(
      "carts_products_cart_id_fk",
      ["cart_id"],
      "carts",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .addForeignKeyConstraint(
      "carts_products_product_id_fk",
      ["product_id"],
      "products",
      ["id"],
      (cb) => cb.onDelete("cascade"),
    )
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("carts").execute();
}
