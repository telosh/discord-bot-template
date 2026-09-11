import { getSettings } from '../db/router.js';

/**
 * Build a welcome message for a user.
 * Uses the guild's configured welcome message, or a default.
 */
export async function getWelcomeMessage(guildId: string | null | undefined, username: string): Promise<string> {
  let base = 'Hello!';
  if (guildId) {
    try {
      const settings = await getSettings(guildId);
      if (settings.welcomeMessage) {
        base = settings.welcomeMessage;
      }
    } catch (error) {
      // Fall back to default if the guild DB is not yet provisioned.
    }
  }
  return base.replace(/\$\{username\}/g, username).replace(/\$user/g, username);
}
