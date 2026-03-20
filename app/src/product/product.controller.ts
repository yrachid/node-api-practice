import type { Request, Response } from "express";
import type { Connection } from "../database.module";

const createController = (connection: Connection) => {
  async function index(_: Request, res: Response) {
    const products = await connection
      .selectFrom("products")
      .selectAll()
      .execute();

    return res.json({
      data: products,
      count: products.length,
    });
  }

  async function get(req: Request, res: Response) {
    const product = await connection
      .selectFrom("products")
      .where("id", "=", parseInt(req.params.id as string))
      .selectAll()
      .executeTakeFirst();

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    return res.json(product);
  }

  async function create(req: Request, res: Response) {
    const result = await connection
      .insertInto("products")
      .values({
        name: req.body.name as string,
        price: req.body.price as number,
      })
      .executeTakeFirst();

    return res.status(201).json({
      id: result.insertId,
      name: req.body.name,
      price: req.body.price,
    });
  }

  return { index, get, create };
};

export const ProductController = { create: createController };
