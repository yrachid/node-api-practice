import { ApplicationModule } from "./application.module";
import { configDotenv } from "dotenv";

function start() {
  configDotenv({
    quiet: true,
  });

  const { app, configuration, logger } = ApplicationModule.create(process.env);

  app.listen(configuration.port, () => {
    logger.info({ message: "up", port: configuration.port });
  });
}

start();
