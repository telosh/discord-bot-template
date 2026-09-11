import { migrate } from 'drizzle-orm/libsql/migrator';
import { env } from '../config/env.js';
import { logger } from '../infra/logger.js';
import { registerGuild } from './control/guilds.js';
import { withGuildDb } from './router.js';
import { ensureSettings } from './guild/settings.js';

export async function provisionGuildDb(guildId: string, guildName?: string): Promise<void> {
  const name = guildName ?? `guild-${guildId}`;
  const dbUrl = resolveGuildDbUrl(guildId);
  const dbToken = env.TURSO_GROUP_TOKEN;

  await registerGuild(guildId, name, dbUrl, dbToken);
  await withGuildDb(guildId, async (db) => {
    await migrate(db, { migrationsFolder: './drizzle/guild' });
    await ensureSettings(db);
  });
  logger.info({ guild: guildId, dbUrl }, 'Guild DB provisioned');
}

function resolveGuildDbUrl(guildId: string): string {
  if (env.TURSO_TEMPLATE_DB_URL.startsWith('file:')) {
    return `file:./data/guild-${guildId}.db`;
  }
  // TODO: replace with actual Turso per-guild provisioning API call
  return env.TURSO_TEMPLATE_DB_URL;
}
