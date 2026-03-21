import { ApplicationModule } from "./application.module";
import { configDotenv } from "dotenv";
import { Profile } from "./configuration.module";

function start() {
  const profile = process.env.NODE_ENV;

  configDotenv({
    quiet: true,
    path: profile === Profile.TEST ? ".env.test" : ".env",
  });

  const { app, configuration, logger } = ApplicationModule.create(process.env);

  app.listen(configuration.port, () => {
    logger.info({ message: "up", port: configuration.port });
  });
}

start();
