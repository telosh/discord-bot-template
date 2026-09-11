import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import type { Command } from '../../discord/command.js';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows available commands.'),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setTitle('Help')
      .setDescription('This is a Discord bot template.')
      .addFields(
        { name: '/ping', value: 'Check bot latency.', inline: true },
        { name: '/help', value: 'Show this message.', inline: true },
        { name: '/settings', value: 'Manage guild settings (admin).', inline: true },
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
