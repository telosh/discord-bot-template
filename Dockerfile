FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
RUN bun run build:web

FROM oven/bun:1-slim
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /app/data
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/web/dist ./web/dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
RUN bun install --production --frozen-lockfile
VOLUME ["/app/data"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"
CMD ["bun", "run", "dist/index.js"]
