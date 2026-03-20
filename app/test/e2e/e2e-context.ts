import { test as baseTest, suite as baseSuite } from "vitest";
import { ApplicationModule } from "../../src/application.module";

const TEST_ENV = {
  DATABASE_HOST: "localhost",
  DATABASE_NAME: "stockroom_test",
  DATABASE_PASSWORD: "postgres",
  DATABASE_POOL_SIZE: "1",
  DATABASE_PORT: "5433",
  DATABASE_USER: "postgres",
  PORT: "3002",
};

export const test = baseTest.extend("context", () => {
  return ApplicationModule.create(TEST_ENV);
});
