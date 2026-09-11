import { AutocompleteInteraction, ChatInputCommandInteraction, Collection, type Interaction } from 'discord.js';
import type { Command } from '../command.js';
import type { ContextMenuCommand } from '../contextMenu.js';
import { env } from '../../config/env.js';
import { isAdmin } from '../permissions.js';
import { logger } from '../../infra/logger.js';

const cooldowns = new Collection<string, Collection<string, number>>();

function checkCooldown(interaction: ChatInputCommandInteraction, command: Command): boolean {
  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name)!;
  const defaultCooldown = env.NODE_ENV === 'development' ? 0 : 3;
  const cooldownAmount = (command.cooldownSeconds ?? defaultCooldown) * 1000;
  const last = timestamps.get(interaction.user.id) ?? 0;

  if (now < last + cooldownAmount) {
    return false;
  }
  timestamps.set(interaction.user.id, now);
  return true;
}

export const name = 'interactionCreate';

export async function execute(
  interaction: Interaction,
  commands: Collection<string, Command>,
  contextMenus: Collection<string, ContextMenuCommand>,
): Promise<void> {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    if (!command) return;

    if (command.developerOnly && !isAdmin(interaction.user.id)) {
      await interaction.reply({ content: 'This command is for admins only.', ephemeral: true });
      return;
    }

    if (!checkCooldown(interaction, command)) {
      await interaction.reply({
        content: 'Please wait a moment before using this again.',
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error({ error, command: command.data.name }, 'Command execution failed');
      const message = { content: 'An error occurred.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(message);
      } else {
        await interaction.reply(message);
      }
    }
  } else if (interaction.isAutocomplete()) {
    const command = commands.get(interaction.commandName);
    if (!command?.autocomplete) return;
    try {
      await command.autocomplete(interaction as AutocompleteInteraction);
    } catch (error) {
      logger.error({ error, command: command.data.name }, 'Autocomplete failed');
    }
  } else if (interaction.isContextMenuCommand()) {
    const menu = contextMenus.get(interaction.commandName);
    if (!menu) return;
    try {
      await menu.execute(interaction);
    } catch (error) {
      logger.error({ error, menu: menu.data.name }, 'Context menu execution failed');
      const message = { content: 'An error occurred.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(message);
      } else {
        await interaction.reply(message);
      }
    }
  }
}
