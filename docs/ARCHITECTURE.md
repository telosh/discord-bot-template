# Architecture

## Overview

This is a public Discord bot template built with **Bun**, **discord.js**, **Hono**, **React**, and **Turso**.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Discord   │────▶│   Bot Core   │────▶│   Control   │
│   Gateway   │     │  (discord.js)│     │     DB      │
└─────────────┘     └──────┬───────┘     └──────┬──────┘
                           │                    │
                           │              ┌─────▼──────┐
                           │              │  Per-Guild │
                           │              │    DBs     │
                           │              └────────────┘
                    ┌──────▼───────┐
                    │   Web API    │
                    │    (Hono)    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Web /       │
                    │  Activity UI │
                    │  (React)     │
                    └──────────────┘
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
