import { Worker } from "bullmq";
import Redis from "ioredis";
import { validateEnv } from "@creator-os/config/env";

// Validate env (already loaded by dotenv-cli in npm script)
const env = validateEnv();

const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

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

