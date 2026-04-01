FROM node:20-alpine AS deps
WORKDIR /repo
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/worker ./apps/worker
RUN pnpm install --frozen-lockfile=false

FROM node:20-alpine AS builder
WORKDIR /repo
RUN corepack enable
COPY --from=deps /repo /repo
RUN pnpm --filter @creator-os/worker... build

FROM node:20-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/worker ./apps/worker
COPY --from=builder /repo/apps/worker/dist ./apps/worker/dist
RUN pnpm -C apps/worker install --prod --frozen-lockfile=false
CMD ["node", "apps/worker/dist/main.js"]

