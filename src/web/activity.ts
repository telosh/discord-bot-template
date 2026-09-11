import type { Hono } from 'hono';
import type { Client } from 'discord.js';
import { env } from '../config/env.js';

export function registerActivityRoutes(api: Hono, _client: Client): void {
  // Discord Activity (Embedded App SDK) API shell.
  // Use this to expose game state or user-bound endpoints.
  api.get('/activity/config', (c) =>
    c.json({
      clientId: env.DISCORD_CLIENT_ID,
      // Put your Activity-specific configuration here.
    }),
  );
}
