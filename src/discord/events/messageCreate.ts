import type { Message } from 'discord.js';
import { isAllowedChannel } from '../permissions.js';
import { logger } from '../../infra/logger.js';
import { getWelcomeMessage } from '../../services/greeting.js';

export const name = 'messageCreate';

export async function execute(message: Message): Promise<void> {
  if (message.author.bot) return;
  if (!isAllowedChannel(message.channel.id)) return;

  logger.debug({ author: message.author.id, content: message.content }, 'Message received');

  if (message.mentions.has(message.client.user?.id ?? '', { ignoreEveryone: true })) {
    const reply = await getWelcomeMessage(message.guildId, message.author.username);
    await message.reply(reply);
  }
}
