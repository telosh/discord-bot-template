# discord-bot-template

A public OSS Discord bot template using **Bun + discord.js + Hono + React + Turso**.

This is intended to be a clean, well-organized starting point for your own Discord bot. The web UI and Discord Activity are provided as a complete shell so you can build on top of them.

## Features

- ✅ Slash command auto-loader (`src/commands/<category>/<name>.ts`)
- ✅ Type-safe environment config (Zod)
- ✅ Per-guild DB pattern with Turso / SQLite (Drizzle ORM)
- ✅ Web admin / Activity shell (Hono + Vite + React)
- ✅ Discord OAuth login shell
- ✅ Docker / docker-compose ready
- ✅ GitHub Actions CI

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
- [Architecture](docs/ARCHITECTURE.md)
- [Deploy](docs/DEPLOY.md)

## License

MIT — see [LICENSE](LICENSE).
