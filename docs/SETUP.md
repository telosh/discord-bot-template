# Setup Guide

## Requirements

- [Bun](https://bun.sh) 1.2+
- A [Discord application](https://discord.com/developers/applications) with a bot user
- (Optional) A [Turso](https://turso.tech) database, or use local SQLite

> **Important:** Create a dedicated database for this bot (e.g. `discord-bot-template`). Do not reuse an existing database such as `bot-prod` to avoid mixing data.

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

## 3. Create a Turso Database (Optional)

If you want to use Turso instead of local SQLite:

```bash
# Install the Turso CLI and login
npx turso auth login

# Create a dedicated database for this bot
npx turso db create discord-bot-template

# Get the connection URL and token
npx turso db show discord-bot-template
npx turso db tokens create discord-bot-template
```

Copy the URL and token into `.env`:

```bash
CONTROL_DB_URL=https://discord-bot-template-ORG.turso.io
CONTROL_DB_TOKEN=...
TURSO_TEMPLATE_DB_URL=https://discord-bot-template-ORG.turso.io
TURSO_GROUP_TOKEN=...
```

> **Do not reuse an existing database.** This bot creates per-guild tables. Using `bot-prod` or any other shared database can cause data loss or conflicts.

## 4. Migrate DB

```bash
bun run db:migrate:all
```

## 5. Register Commands

```bash
bun run deploy:commands
```

## 6. Run

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
