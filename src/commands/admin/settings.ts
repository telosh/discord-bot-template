import { PermissionFlagsBits, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../../discord/command.js';
import { getSettings, updateSettings } from '../../db/router.js';
import { logger } from '../../infra/logger.js';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Manage guild settings.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) =>
      option
        .setName('welcome_message')
        .setDescription('Set the welcome message.')
        .setRequired(false),
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const welcome = interaction.options.getString('welcome_message');

    if (!interaction.guildId) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    try {
      if (welcome === null) {
        const settings = await getSettings(interaction.guildId);
        await interaction.reply({
          content: `Current welcome message: ${settings.welcomeMessage ?? '(none)'}`,
          ephemeral: true,
        });
        return;
      }

      await updateSettings(interaction.guildId, { welcomeMessage: welcome });
      await interaction.reply({ content: 'Settings updated.', ephemeral: true });
    } catch (error) {
      logger.error({ error, guild: interaction.guildId }, 'Settings command failed');
      await interaction.reply({ content: 'Failed to update settings.', ephemeral: true });
    }
  },
};
