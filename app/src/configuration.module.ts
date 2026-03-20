export type Env = Record<string, string | undefined>;

type ReadOptions = {
  allowedValues?: Array<string>;
};

function readString<T extends string>(
  env: Env,
  name: string,
  options?: ReadOptions,
) {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  if (options?.allowedValues && !options.allowedValues.includes(value)) {
    throw new Error(
      `Invalid value for environment variable ${name}. Expected one of: ${options.allowedValues}`,
    );
  }

  return value as T;
}

function readNumber(env: Env, name: string) {
  const stringValue = readString(env, name);

  const parsed = parseInt(stringValue);

  if (isNaN(parsed)) {
    throw new Error(`Expected numeric value for variable ${name}`);
  }

  return parsed;
}

export const Profile = {
  TEST: "test",
  STAGING: "staging",
  PRODUCTION: "production",
} as const;

export type Profile = "test" | "staging" | "production";

export type AppConfig = {
  port: number;
  profile: Profile;
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
    profile: readString(env, "NODE_ENV", {
      allowedValues: Object.values(Profile),
    }),
    port: readNumber(env, "PORT"),
  };
}

export const ConfigurationModule = { create };
