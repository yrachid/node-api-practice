export type Env = Record<string, string | undefined>;

type ReadOptions = {
  allowedValues?: Array<string>;
};

export const envReader = (env: Env) => {
  function readString<T extends string>(name: string, options?: ReadOptions) {
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

  function readNumber(name: string) {
    const stringValue = readString(name);

    const parsed = parseInt(stringValue);

    if (isNaN(parsed)) {
      throw new Error(`Expected numeric value for variable ${name}`);
    }

    return parsed;
  }

  return { string: readString, number: readNumber };
};

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
  redis: {
    host: string;
    port: number;
  };
};

export function create(env: Env): AppConfig {
  const reader = envReader(env);

  return {
    database: {
      host: reader.string("DATABASE_HOST"),
      port: reader.number("DATABASE_PORT"),
      name: reader.string("DATABASE_NAME"),
      user: reader.string("DATABASE_USER"),
      password: reader.string("DATABASE_PASSWORD"),
      poolSize: reader.number("DATABASE_POOL_SIZE"),
    },
    redis: {
      host: reader.string("REDIS_HOST"),
      port: reader.number("REDIS_PORT"),
    },
    profile: reader.string("NODE_ENV", {
      allowedValues: Object.values(Profile),
    }),
    port: reader.number("PORT"),
  };
}

export const ConfigurationModule = { create };
