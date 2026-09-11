import { eq } from 'drizzle-orm';
import { createControlDb } from './client.js';
import { guilds } from './schema.js';

export async function registerGuild(id: string, name: string, dbUrl?: string, dbToken?: string): Promise<void> {
  const db = createControlDb();
  await db
    .insert(guilds)
    .values({ id, name, dbUrl, dbToken })
    .onConflictDoUpdate({
      target: guilds.id,
      set: { name, dbUrl, dbToken },
    });
}

export async function getGuildRow(id: string): Promise<{ dbUrl?: string | null; dbToken?: string | null } | undefined> {
  const db = createControlDb();
  const row = await db.select().from(guilds).where(eq(guilds.id, id)).get();
  return row
    ? { dbUrl: row.dbUrl, dbToken: row.dbToken }
    : undefined;
}
