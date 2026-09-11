# Setup Guide

## Requirements

- [Bun](https://bun.sh) 1.1+
- A [Discord application](https://discord.com/developers/applications) with a bot user
- (Optional) A [Turso](https://turso.tech) database group, or use local SQLite

## 1. Install

```bash
bun install
```

## 2. Configure

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

At minimum:

- `DISCORD_TOKEN` — Bot token
- `DISCORD_CLIENT_ID` — Application ID
- `DISCORD_GUILD_ID` — Test server ID (for fast guild command registration)

## 3. Migrate DB

```bash
bun run db:migrate:all
```

## 4. Register Commands

```bash
bun run deploy:commands
```

## 5. Run

```bash
bun run dev
```

## Web / Activity

To enable the web/Activity shell, also set:

- `DISCORD_CLIENT_SECRET`
- `OAUTH_REDIRECT_URI` (e.g. `http://localhost:3000/auth/callback`)
- `SESSION_SECRET`

Then build the web UI:

```bash
bun run build:web
```

## Deploy

Use Docker:

```bash
docker compose up --build -d
```

Or deploy the `Dockerfile` to Railway, Fly.io, Render, etc.
