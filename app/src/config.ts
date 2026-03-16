import { configDotenv } from "dotenv";

function readString(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function readNumber(name: string) {
  const stringValue = readString(name);

  const parsed = parseInt(stringValue);

  if (isNaN(parsed)) {
    throw new Error(`Expected numeric value for variable ${name}`);
  }

  return parsed;
}

export const Config = {
  database: {
    host: () => readString("DATABASE_HOST"),
    port: () => readNumber("DATABASE_PORT"),
    name: () => readString("DATABASE_NAME"),
    user: () => readString("DATABASE_USER"),
    password: () => readString("DATABASE_PASSWORD"),
    poolSize: () => readNumber("DATABASE_POOL_SIZE"),
  },
  port: () => readNumber("PORT"),
};

export type AppConfig = {
  port: number;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    poolSize: number;
  };
};

export const loadAppConfig = (): AppConfig => {
  configDotenv();

  return {
    database: {
      host: readString("DATABASE_HOST"),
      port: readNumber("DATABASE_PORT"),
      name: readString("DATABASE_NAME"),
      user: readString("DATABASE_USER"),
      password: readString("DATABASE_PASSWORD"),
      poolSize: readNumber("DATABASE_POOL_SIZE"),
    },
    port: readNumber("PORT"),
  };
};
