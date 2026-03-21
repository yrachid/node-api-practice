import { promises as fs } from "node:fs";
import path from "node:path";
import { configDotenv } from "dotenv";
import { Migrator, FileMigrationProvider, NO_MIGRATIONS } from "kysely";
import { ConfigurationModule } from "./configuration.module";
import { DatabaseModule } from "./database.module";
import { LoggerModule } from "./logger.module";

async function migrate(direction: "up" | "down") {
  const activeEnv = process.env.NODE_ENV;

  if (activeEnv?.toLowerCase() === "test") {
    configDotenv({ path: ".env.test" });
  } else {
    configDotenv();
  }

  const config = ConfigurationModule.create(process.env);
  const { logger } = LoggerModule.create("staging");

  const { connection } = DatabaseModule.create(config, logger);

  const migrator = new Migrator({
    db: connection,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(import.meta.dirname, "migrations"),
    }),
  });

  const result =
    direction === "up"
      ? await migrator.migrateToLatest()
      : await migrator.migrateTo(NO_MIGRATIONS);

  result.results?.forEach((it) => {
    if (it.status === "Success") {
      logger.info({
        event: "migration.success",
        name: it.migrationName,
        direction,
      });
    } else if (it.status === "Error") {
      logger.error({
        event: "migration.error",
        name: it.migrationName,
        direction,
      });
    }
  });

  await connection.destroy();

  if (result.error) {
    logger.error({
      event: "migration.failure",
      error: result.error,
    });
    process.exit(1);
  }
}

const direction = process.argv[2] === "down" ? "down" : "up";
migrate(direction);
