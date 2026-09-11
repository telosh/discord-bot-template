import { ActivityType, type Client } from 'discord.js';

export function setPresence(client: Client, text: string): void {
  client.user?.setPresence({
    status: 'online',
    activities: [{ name: text, type: ActivityType.Listening }],
  });
}
