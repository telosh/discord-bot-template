import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import type { ContextMenuCommand } from '../discord/contextMenu.js';

export const contextMenu: ContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Pin Message')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    if (!interaction.isMessageContextMenuCommand()) return;
    await interaction.reply({ content: `Pinned message ${interaction.targetMessage.id}`, ephemeral: true });
  },
};
