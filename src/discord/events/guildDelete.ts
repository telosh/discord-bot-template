import type { Guild } from 'discord.js';
import { logger } from '../../infra/logger.js';
import { releaseGuildDb } from '../../db/router.js';

export const name = 'guildDelete';

export async function execute(guild: Guild): Promise<void> {
  logger.info({ guild: guild.id, name: guild.name }, 'Left guild');
  await releaseGuildDb(guild.id).catch((error) => {
    logger.error({ error, guild: guild.id }, 'Failed to release guild DB');
  });
}
