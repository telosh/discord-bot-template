FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
RUN bun run build:web

FROM oven/bun:1-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/web/dist ./web/dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/package.json ./
RUN bun install --production --frozen-lockfile
VOLUME ["/app/data"]
EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]
