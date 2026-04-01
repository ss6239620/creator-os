import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  NATS_URL: z.string().default("nats://localhost:4222"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("30d"),
  WEB_URL: z.string().url().default("http://localhost:3000"),
  API_URL: z.string().url().default("http://localhost:4000"),
  PORT: z.coerce.number().optional(),
  API_PORT: z.coerce.number().optional(),
  WEB_PORT: z.coerce.number().optional(),
  WORKER_PORT: z.coerce.number().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    console.error("❌ Invalid environment variables:\n" + errors);
    process.exit(1);
  }
  return result.data;
}

export const getApiPort = (env: Env) => env.API_PORT || env.PORT || 4000;
export const getWebPort = (env: Env) => env.WEB_PORT || 3000;
export const getWorkerPort = (env: Env) => env.WORKER_PORT || 5000;
export { z };
