import { createClient, type Client as LibsqlClient } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { dbEnv } from '../../config/dbEnv.js';
import * as schema from './schema.js';

export type ControlDb = LibSQLDatabase<typeof schema>;

export function createControlClient(): LibsqlClient {
  return createClient({
    url: dbEnv.CONTROL_DB_URL,
    authToken: dbEnv.CONTROL_DB_TOKEN,
  });
}

export function createControlDb(client: LibsqlClient = createControlClient()): ControlDb {
  return drizzle(client, { schema });
}
