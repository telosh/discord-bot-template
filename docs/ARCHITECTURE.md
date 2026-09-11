# Architecture

The project is a public Discord bot template built with **Bun, discord.js, Hono, React, and Turso**.

For the background behind each technology choice, see [ARCHITECTURE_RATIONALE.md](ARCHITECTURE_RATIONALE.md).

## System Diagram

The editable source is [architecture.drawio](architecture.drawio). Open it with [app.diagrams.net](https://app.diagrams.net/) or the Draw.io VS Code extension.

```
                    Discord
                  ┌─────────┐
                  │ Gateway │
                  └────┬────┘
                       │
                       ▼
              ┌──────────────────┐
              │   discord.js     │
              │    bot core      │
              └────────┬─────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  Hono    │  │ Control  │  │ Per-Guild│
   │ web API  │  │    DB    │  │    DBs   │
   └────┬─────┘  └──────────┘  └──────────┘
        │
        ▼
   ┌──────────┐
   │ Web /    │
   │ Activity │
   │ (React)  │
   └──────────┘
```

## Modules

| Path | Responsibility |
|------|----------------|
| `src/config` | Environment validation with Zod |
| `src/discord` | Client, command loader, permissions, events |
| `src/commands` | Auto-loaded slash commands by category |
| `src/context-menus` | Auto-loaded context menu commands |
| `src/db` | Drizzle ORM, control + per-guild DB router |
| `src/infra` | Logger and shared infrastructure |
| `src/services` | Domain services (add your own logic here) |
| `src/web` | Hono web/Activity server and auth shell |
| `web` | Vite + React frontend shell |

## Data Flow

1. Discord Gateway sends events (`interactionCreate`, `guildCreate`, `messageCreate`, etc.).
2. `src/discord/loader.ts` discovers and loads `src/commands/**` and `src/context-menus/**`.
3. Event handlers route to the matching command/context menu.
4. Commands that need state call `src/db/router.ts` for per-guild DB access.
5. `src/web/server.ts` serves the React admin UI and Activity, plus OAuth and JSON APIs.

## Adding a Command

Create `src/commands/<category>/<name>.ts` and export a `command` object:

```ts
import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../discord/command.js';

export const command: Command = {
  data: new SlashCommandBuilder().setName('hello').setDescription('Say hello'),
  async execute(interaction) {
    await interaction.reply('Hello!');
  },
};
```

Run `bun run deploy:commands` to register it.
