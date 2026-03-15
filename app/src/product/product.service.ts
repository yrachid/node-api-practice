import { db } from "../database/connection.js";

export const ProductService = {
  all: async () => db.selectFrom("products").selectAll().execute(),
};
