import type { Express } from "express";
import { buildApplicationServer } from "./server.js";
import { Config } from "./config.js";
import { configDotenv } from "dotenv";

configDotenv();

const app: Express = buildApplicationServer();

app.listen(Config.port(), () => {
  console.log(`up on ${Config.port()}`);
});
