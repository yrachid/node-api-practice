import { Router } from "express";

const create = () => {
  const router = Router();

  router.get("/health", (_, res) => {
    res.json({ ok: true });
  });

  return { router };
};

export const HealthCheckModule = { create };
