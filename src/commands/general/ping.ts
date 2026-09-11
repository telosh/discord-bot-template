import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../../discord/command.js';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with bot latency.'),
  cooldownSeconds: 5,
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sent = await interaction.reply({ content: 'Pong! measuring...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! Round-trip: ${latency}ms / WebSocket: ${interaction.client.ws.ping}ms`);
  },
};
