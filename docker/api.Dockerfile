FROM node:20-alpine AS deps
WORKDIR /repo
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN pnpm install --frozen-lockfile=false

FROM node:20-alpine AS builder
WORKDIR /repo
RUN corepack enable
COPY --from=deps /repo /repo
RUN pnpm --filter @creator-os/api... build

FROM node:20-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY --from=builder /repo/apps/api/dist ./apps/api/dist
RUN pnpm -C apps/api install --prod --frozen-lockfile=false
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]

