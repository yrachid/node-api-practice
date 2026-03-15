import type { Express } from "express";
import { buildApplicationServer } from "./server.js";

const app: Express = buildApplicationServer();

app.listen(3001, () => {
  console.log("up");
});
