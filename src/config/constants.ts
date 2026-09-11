import { GatewayIntentBits, Partials } from 'discord.js';

export const DEFAULT_COOLDOWN_SECONDS = 3;

export const CLIENT_INTENTS = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent,
];

export const CLIENT_PARTIALS = [Partials.Channel, Partials.Message, Partials.Reaction];
