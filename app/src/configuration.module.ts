export type Env = Record<string, string | undefined>;

function readString(env: Env, name: string) {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function readNumber(env: Env, name: string) {
  const stringValue = readString(env, name);

  const parsed = parseInt(stringValue);

  if (isNaN(parsed)) {
    throw new Error(`Expected numeric value for variable ${name}`);
  }

  return parsed;
}

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

export function create(env: Env): AppConfig {
  return {
    database: {
      host: readString(env, "DATABASE_HOST"),
      port: readNumber(env, "DATABASE_PORT"),
      name: readString(env, "DATABASE_NAME"),
      user: readString(env, "DATABASE_USER"),
      password: readString(env, "DATABASE_PASSWORD"),
      poolSize: readNumber(env, "DATABASE_POOL_SIZE"),
    },
    port: readNumber(env, "PORT"),
  };
}

export const ConfigurationModule = { create };
