import { createClient, type Client as LibsqlClient } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './guild/schema.js';

export type GuildDb = LibSQLDatabase<typeof schema>;

export function createGuildClient(url: string, authToken?: string): LibsqlClient {
  return createClient({
    url,
    authToken,
  });
}

export function createGuildDb(client: LibsqlClient): GuildDb {
  return drizzle(client, { schema });
}

export function createGuildDbFromUrl(url: string, authToken?: string): GuildDb {
  return createGuildDb(createGuildClient(url, authToken));
}
