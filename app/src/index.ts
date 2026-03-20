import { ApplicationModule } from "./application.module";
import { configDotenv } from "dotenv";

function start() {
  configDotenv();

  const { app, configuration } = ApplicationModule.create(process.env);

  app.listen(configuration.port, () => {
    console.log(`up on ${configuration.port}`);
  });
}

start();
