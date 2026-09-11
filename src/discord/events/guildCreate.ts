import type { Guild } from 'discord.js';
import { logger } from '../../infra/logger.js';
import { provisionGuildDb } from '../../db/provision.js';

export const name = 'guildCreate';

export async function execute(guild: Guild): Promise<void> {
  logger.info({ guild: guild.id, name: guild.name }, 'Joined new guild');
  try {
    await provisionGuildDb(guild.id);
  } catch (error) {
    logger.error({ error, guild: guild.id }, 'Failed to provision guild DB');
  }
}
