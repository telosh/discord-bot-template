import { env } from '../config/env.js';
import { createControlClient, createControlDb } from './control/client.js';
import { getGuildRow, registerGuild } from './control/guilds.js';
import { guilds } from './control/schema.js';
import { createGuildDb, createGuildClient } from './client.js';
import {
  ensureSettings as ensureSettingsRow,
  updateSettings as updateSettingsRow,
  type Settings,
} from './guild/settings.js';
import type { GuildDb } from './client.js';

export class GuildNotReadyError extends Error {
  constructor(guildId: string) {
    super(`Guild DB not ready: ${guildId}`);
    this.name = 'GuildNotReadyError';
  }
}

const controlClient = createControlClient();
const controlDb = createControlDb(controlClient);
const guildDbs = new Map<string, GuildDb>();
const guildClients = new Map<string, ReturnType<typeof createGuildClient>>();

function resolveGuildDbUrl(guildId: string): string {
  if (env.TURSO_TEMPLATE_DB_URL.startsWith('file:')) {
    return `file:./data/guild-${guildId}.db`;
  }
  // Turso per-guild URL pattern. Replace with your own provisioning logic.
  return env.TURSO_TEMPLATE_DB_URL;
}

export async function withGuildDb<T>(guildId: string, fn: (db: GuildDb) => Promise<T>): Promise<T> {
  if (!guildDbs.has(guildId)) {
    const row = await getGuildRow(guildId);
    const url = row?.dbUrl ?? resolveGuildDbUrl(guildId);
    const token = row?.dbToken ?? env.TURSO_GROUP_TOKEN;
    const client = createGuildClient(url, token);
    const db = createGuildDb(client);
    guildClients.set(guildId, client);
    guildDbs.set(guildId, db);
  }
  const db = guildDbs.get(guildId)!;
  return fn(db);
}

export async function getSettings(guildId: string): Promise<Settings> {
  return withGuildDb(guildId, (db) => ensureSettingsRow(db));
}

export async function updateSettings(guildId: string, patch: Partial<Settings>): Promise<void> {
  return withGuildDb(guildId, (db) => updateSettingsRow(db, patch));
}

export async function releaseGuildDb(guildId: string): Promise<void> {
  const client = guildClients.get(guildId);
  if (client) {
    client.close();
    guildClients.delete(guildId);
  }
  guildDbs.delete(guildId);
}

export async function closeAllDbs(): Promise<void> {
  for (const client of guildClients.values()) {
    client.close();
  }
  controlClient.close();
  guildClients.clear();
  guildDbs.clear();
}

export async function listGuildRows(): Promise<Array<typeof guilds.$inferSelect>> {
  return controlDb.select().from(guilds).all();
}

export { registerGuild, controlDb };
