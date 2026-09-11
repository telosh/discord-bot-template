import { eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

export type GuildDb = LibSQLDatabase<typeof schema>;

export interface Settings {
  welcomeMessage: string | null;
}

export async function ensureSettings(db: GuildDb): Promise<Settings> {
  await db.insert(schema.settings).values({ id: 1 }).onConflictDoNothing({ target: schema.settings.id });
  const row = await db.select().from(schema.settings).where(eq(schema.settings.id, 1)).get();
  return { welcomeMessage: row?.welcomeMessage ?? null };
}

export async function updateSettings(db: GuildDb, patch: Partial<Settings>): Promise<void> {
  await db
    .update(schema.settings)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(schema.settings.id, 1));
}
