import type { Message } from 'discord.js';
import { isAllowedChannel } from '../permissions.js';
import { logger } from '../../infra/logger.js';

export const name = 'messageCreate';

export async function execute(message: Message): Promise<void> {
  if (message.author.bot) return;
  if (!isAllowedChannel(message.channel.id)) return;

  logger.debug({ author: message.author.id, content: message.content }, 'Message received');

  // TODO: auto-responder or mention handler
  if (message.mentions.has(message.client.user?.id ?? '', { ignoreEveryone: true })) {
    await message.reply('Hello! Use `/help` to see what I can do.');
  }
}
