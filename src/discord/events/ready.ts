import type { Client } from 'discord.js';
import { logger } from '../../infra/logger.js';

export const name = 'ready';

export function execute(client: Client<true>): void {
  logger.info(
    { user: client.user.tag, guilds: client.guilds.cache.size },
    'Bot is ready',
  );
}
