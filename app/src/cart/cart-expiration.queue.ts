import { Job, Queue, Worker } from "bullmq";
import type { AppConfig } from "../configuration.module";
import type { Connection } from "../database.module";
import { Logger } from "../logger.module";

const QUEUE_NAME = "cart-expiration";
const EVERY_MINUTE = "* * * * *";

const workerHandler = (db: Connection, logger: Logger) => async (job: Job) => {
  logger.info({
    event: "cart_expiration.worker.start",
    jobName: job.name,
  });

  const cartCount = await db
    .selectFrom("carts")
    .select(({ fn }) => fn.count("id").as("count"))
    .executeTakeFirstOrThrow();

  logger.info({
    event: "cart_expiration.worker.end",
    cartCount: cartCount.count,
  });
};

function create(config: AppConfig, logger: Logger, db: Connection) {
  const connection = { host: config.redis.host, port: config.redis.port };

  const queue = new Queue(QUEUE_NAME, { connection });

  const worker = new Worker(QUEUE_NAME, workerHandler(db, logger), {
    connection,
    concurrency: 1,
  });

  const schedule = async () => {
    await queue.upsertJobScheduler(
      "expire-carts",
      {
        pattern: EVERY_MINUTE,
      },
      {
        name: "expire-carts",
        data: {},
        opts: {
          removeOnComplete: 100,
          removeOnFail: 1000,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        },
      },
    );
  };

  return { queue, worker, schedule };
}

export const CartExpirationQueue = { create };
