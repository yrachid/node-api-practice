import { type AppConfig, Profile } from "./configuration.module";
import type { NextFunction, Request, Response } from "express";

export type LogPayload = Record<string, unknown>;

export type ApplicationLogger = {
  info(payload: LogPayload): void;
  error(payload: LogPayload): void;
};

export class Logger {
  constructor(private readonly profile: Profile) {}

  info(payload: LogPayload) {
    this._log("info", payload);
  }

  error(payload: LogPayload) {
    this._log("error", payload);
  }

  private _log(level: string, payload: LogPayload) {
    if (this.profile !== Profile.TEST) {
      console.log(
        JSON.stringify({
          time: new Date(),
          level,
          ...payload,
        }),
      );
    }
  }
}

function httpMiddleware(logger: Logger) {
  return function loggerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const requestHandleStartTime = process.hrtime.bigint();

    logger.info({
      event: "http.request",
      route: `${req.method} ${req.originalUrl}`,
      params: req.params,
      headers: req.headers,
    });

    res.on("finish", () => {
      const responseFinishTime = process.hrtime.bigint();

      const durationMs = (
        Number(responseFinishTime - requestHandleStartTime) / 1_000_000
      ).toFixed(2);

      const route = `${req.method} ${req.originalUrl}`;

      logger.info({
        event: "http.response",
        route,
        durationMs,
        response: {
          status: res.statusCode,
          headers: res.getHeaders(),
        },
      });
    });

    next();
  };
}

function create(configuration: AppConfig) {
  const logger = new Logger(configuration.profile);

  return {
    logger,
    httpMiddleware: httpMiddleware(logger),
  };
}

export const LoggerModule = { create };
