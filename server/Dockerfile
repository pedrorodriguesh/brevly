FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY server/package.json ./server/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

WORKDIR /app/server

COPY server/package.json server/tsconfig.json server/tsconfig.build.json ./
COPY server/src ./src

RUN pnpm run build

FROM base AS deploy

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY server/package.json ./server/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod && \
    pnpm deploy --filter=server --prod --legacy /app/deploy

FROM node:22-alpine AS runner

LABEL org.opencontainers.image.title="Brevly API"
LABEL org.opencontainers.image.description="URL shortener API service"
LABEL org.opencontainers.image.vendor="Brevly"
LABEL org.opencontainers.image.source="https://github.com/brevly/brevly"

RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs appuser

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deploy --chown=appuser:nodejs /app/deploy/node_modules ./node_modules

COPY --from=builder --chown=appuser:nodejs /app/server/dist ./dist

COPY --chown=appuser:nodejs server/package.json ./

USER appuser

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3333/docs', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/http/server.js"]
