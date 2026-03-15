import express from "express";
import type { Express } from "express";
import { Routes } from "./routes.js";

export const buildApplicationServer = (): Express => {
  const app = express();

  Routes.register(app);

  return app;
};
