import { Client } from 'discord.js';
import { CLIENT_INTENTS, CLIENT_PARTIALS } from '../config/constants.js';

export function createClient(): Client {
  return new Client({
    intents: CLIENT_INTENTS,
    partials: CLIENT_PARTIALS,
    presence: {
      status: 'online',
      activities: [{ name: '/help', type: 2 }], // Listening
    },
  });
}
