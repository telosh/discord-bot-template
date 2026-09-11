import { migrate } from 'drizzle-orm/libsql/migrator';
import { dbEnv } from '../config/dbEnv.js';
import { logger } from '../infra/logger.js';
import { createControlDb } from './control/client.js';
import { createGuildClient, createGuildDb } from './client.js';
import { listGuildRows } from './router.js';

const target = process.argv[2] ?? 'all';

async function migrateControl(): Promise<void> {
  const db = createControlDb();
  logger.info('Migrating control DB');
  await migrate(db, { migrationsFolder: './drizzle/control' });
  logger.info('Control DB migrated');
}

async function migrateTemplateGuild(): Promise<void> {
  const client = createGuildClient(dbEnv.TURSO_TEMPLATE_DB_URL, dbEnv.TURSO_GROUP_TOKEN);
  const db = createGuildDb(client);
  logger.info({ url: dbEnv.TURSO_TEMPLATE_DB_URL }, 'Migrating template guild DB');
  await migrate(db, { migrationsFolder: './drizzle/guild' });
  logger.info('Template guild DB migrated');
}

async function migrateAllGuilds(): Promise<void> {
  const rows = await listGuildRows();
  const withUrl = rows.filter((row) => row.dbUrl);
  await Promise.all(
    withUrl.map(async (row) => {
      const client = createGuildClient(row.dbUrl!, row.dbToken ?? undefined);
      const db = createGuildDb(client);
      logger.info({ guild: row.id, url: row.dbUrl }, 'Migrating guild DB');
      await migrate(db, { migrationsFolder: './drizzle/guild' });
    }),
  );
}

async function main(): Promise<void> {
  if (target === 'control' || target === 'all') {
    await migrateControl();
  }
  if (target === 'guild' || target === 'all') {
    await migrateTemplateGuild();
  }
  if (target === 'all') {
    await migrateAllGuilds();
  }
}

void main().catch((error) => {
  logger.error({ error }, 'Migration failed');
  process.exit(1);
});
