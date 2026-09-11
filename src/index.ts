import type { Client } from 'discord.js';
import type { Server } from 'node:http';
import { serve } from '@hono/node-server';
import { env } from './config/env.js';
import { logger } from './infra/logger.js';
import { createClient } from './discord/client.js';
import { loadCommands, loadContextMenus } from './discord/loader.js';
import { createWebApp } from './web/server.js';
import * as ready from './discord/events/ready.js';
import * as interactionCreate from './discord/events/interactionCreate.js';
import * as guildCreate from './discord/events/guildCreate.js';
import * as guildDelete from './discord/events/guildDelete.js';
import * as messageCreate from './discord/events/messageCreate.js';
import { closeAllDbs } from './db/router.js';

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Rejection');
});
process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
  process.exit(1);
});

let webServer: Server | undefined;

async function main(): Promise<void> {
  logger.info({ nodeEnv: env.NODE_ENV }, 'Starting bot');

  const client = createClient();
  const [commands, contextMenus] = await Promise.all([
    loadCommands(),
    loadContextMenus(),
  ]);
  logger.info(
    { commands: commands.size, contextMenus: contextMenus.size },
    'Loaded interactions',
  );

  client.once(ready.name, () => {
    ready.execute(client as Client<true>);
  });
  client.on(interactionCreate.name, (interaction) => {
    void interactionCreate.execute(interaction, commands, contextMenus);
  });
  client.on(guildCreate.name, (guild) => {
    void guildCreate.execute(guild);
  });
  client.on(guildDelete.name, (guild) => {
    void guildDelete.execute(guild);
  });
  client.on(messageCreate.name, (message) => {
    void messageCreate.execute(message);
  });

  const app = createWebApp(client);
  webServer = serve({ fetch: app.fetch, port: env.PORT }) as unknown as Server;
  logger.info({ port: env.PORT }, 'Web server started');
  if (!env.SESSION_SECRET || !env.DISCORD_CLIENT_SECRET || !env.OAUTH_REDIRECT_URI) {
    logger.warn('OAuth routes disabled: set SESSION_SECRET, DISCORD_CLIENT_SECRET and OAUTH_REDIRECT_URI');
  }

  await client.login(env.DISCORD_TOKEN);

  process.once('SIGTERM', () => shutdown('SIGTERM', client));
  process.once('SIGINT', () => shutdown('SIGINT', client));
}

function shutdown(signal: string, client: Client): void {
  logger.info({ signal }, 'Shutting down');

  Promise.allSettled([
    new Promise<void>((resolve) => {
      if (!webServer) {
        resolve();
        return;
      }
      webServer.close(() => {
        logger.info('Web server closed');
        resolve();
      });
    }),
    client.destroy(),
    closeAllDbs().catch((error) => logger.error({ error }, 'DB close error')),
  ]).finally(() => {
    logger.info('Shutdown complete');
    process.exit(0);
  });
}

void main().catch((error: unknown) => {
  logger.error({ error }, 'Startup failed');
  process.exit(1);
});
