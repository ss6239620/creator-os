import { Worker } from "bullmq";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
const connection = new Redis(redisUrl, { maxRetriesPerRequest: null });

const workers = [
  new Worker(
    "analytics-sync",
    async () => {
      return;
    },
    { connection },
  ),
  new Worker(
    "content-publish",
    async () => {
      return;
    },
    { connection },
  ),
  new Worker(
    "token-refresh",
    async () => {
      return;
    },
    { connection },
  ),
  new Worker(
    "notifications",
    async () => {
      return;
    },
    { connection },
  ),
];

async function shutdown(signal: string) {
  try {
    await Promise.allSettled(workers.map((w) => w.close()));
    await connection.quit();
  } finally {
    process.exit(0);
  }
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

