# Creator OS

Creator OS is a monorepo SaaS platform for Indian content creators to manage **YouTube**, **Instagram**, and India-native platforms (**Moj**, **Josh**, **ShareChat**) in one place.

This repo currently contains the **infrastructure + project skeleton** (no product logic yet).

## What's inside

- **`apps/api`**: NestJS REST API (JWT auth planned) + Prisma (skeleton)
- **`apps/web`**: Next.js 14 (App Router) web app (skeleton)
- **`apps/worker`**: BullMQ worker service (skeleton)
- **`packages/database`**: Prisma schema + Prisma client exports
- **`packages/types`**: shared TypeScript types (placeholder)
- **`packages/config`**: shared config package (placeholder)
- **`packages/ui`**: shared UI package (placeholder)

## Prerequisites

- **Node.js**: 20+
- **pnpm**: 9+ (repo is pinned via `packageManager` in root `package.json`)
- **Docker** + Docker Compose

## Environment

Copy the example file and adjust as needed:

```bash
cp .env.example .env
```

Key variables (defaults in `.env.example`):
- `DATABASE_URL`
- `REDIS_URL`
- `NATS_URL`
- `JWT_SECRET`

## Development (recommended)

In development, run **infrastructure via Docker**, and run **API + Web locally** for fast reload.

### 1) Start dev infrastructure (Postgres/Redis/NATS/Bull Board)

```bash
pnpm run dev:infra
```

### 2) Run the API locally (watch mode)

```bash
pnpm run api:serve
```

- API base: `http://localhost:4000`
- Swagger: `http://localhost:4000/docs`

### 3) Run the Web app locally (Next dev / hot reload)

```bash
pnpm run web:serve
```

- Web: `http://localhost:3000`

### 4) Bull Board

- Bull Board: `http://localhost:3100`

### Stop dev infrastructure

```bash
pnpm run dev:down
```

## Production-like (Docker Compose)

Build and run everything in containers:

```bash
docker compose up --build -d
docker compose ps
```

Endpoints:
- Web: `http://localhost:3000`
- API Swagger: `http://localhost:4000/docs`
- Bull Board: `http://localhost:3100`

Stop:

```bash
docker compose down --remove-orphans
```

## Workspace scripts

From repo root:

- `pnpm -w build`: build all packages/apps via Turborepo
- `pnpm -w typecheck`: typecheck all packages/apps

## Notes

- **Next.js hot reload** is provided by `next dev` (no nodemon needed).
- `apps/api` uses **nodemon + ts-node** for development reload.

