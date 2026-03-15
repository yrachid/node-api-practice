import type { Request, Response } from "express";

export const HealthController = {
  index: (_: Request, res: Response) =>
    res.json({
      ok: true,
    }),
};
