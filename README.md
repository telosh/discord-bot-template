# discord-bot-template

[![CI](https://github.com/telosh/discord-bot-template/actions/workflows/ci.yml/badge.svg)](https://github.com/telosh/discord-bot-template/actions)
[![License](https://img.shields.io/github/license/telosh/discord-bot-template)](LICENSE)
[![Bun](https://img.shields.io/badge/Bun-1.1%2B-black?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue?logo=typescript)](https://www.typescriptlang.org)

> Public OSS Discord bot template using **Bun + discord.js + Hono + React + Turso**.

[日本語版 README](./README.ja.md)

A clean, well-organized starting point for your own Discord bot. The web UI and Discord Activity are provided as a complete shell so you can build on top of them.

## Why this stack?

This template is designed for **long-term maintainability** and **ease of extension**.

- **Bun** — fast runtime, built-in TypeScript execution, and modern package management.
- **discord.js** — the most mature and widely-used Node.js library for the Discord API.
- **Hono** — lightweight, fast, and portable HTTP framework. Runs on Bun, Node, and edge runtimes.
- **React + Vite** — familiar, modern web stack for the admin UI / Activity shell.
- **Turso / SQLite** — zero-config local development with a clear path to managed, per-guild databases in production.

For a deeper explanation of the design, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/ARCHITECTURE_RATIONALE.md](docs/ARCHITECTURE_RATIONALE.md).

## Features

- Slash command auto-loader (`src/commands/<category>/<name>.ts`)
- Type-safe environment config (Zod)
- Per-guild DB pattern with Turso / SQLite (Drizzle ORM)
- Web admin / Activity shell (Hono + Vite + React)
- Discord OAuth login shell
- Docker / docker-compose ready
- GitHub Actions CI with Bun

## Quickstart

```bash
bun install
cp .env.example .env
# Edit .env with your Discord credentials
bun run db:migrate:all
bun run deploy:commands
bun run dev
```

## Adding a Command

Create `src/commands/general/hello.ts`:

```ts
import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../discord/command.js';

export const command: Command = {
  data: new SlashCommandBuilder().setName('hello').setDescription('Say hello'),
  async execute(interaction) {
    await interaction.reply('Hello, world!');
  },
};
```

Then run:

```bash
bun run deploy:commands
```

## Project Structure

```
src/
  commands/        # Slash commands (auto-loaded)
  context-menus/   # Context menu commands (auto-loaded)
  config/          # Environment & constants
  db/              # Drizzle schemas, control + per-guild clients
  discord/         # Client, command types, loader, permissions
  events/          # Discord.js event handlers
  infra/           # Logger
  services/        # Domain services
  web/             # Hono server, auth, activity
  index.ts         # Entry point
  deploy-commands.ts
web/               # Vite + React shell
```

## Documentation

- [Setup](docs/SETUP.md)
- [Deploy](docs/DEPLOY.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Architecture Rationale](docs/ARCHITECTURE_RATIONALE.md)

## License

MIT — see [LICENSE](LICENSE).
