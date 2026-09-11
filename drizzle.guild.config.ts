import { defineConfig } from 'drizzle-kit';
import { dbEnv } from './src/config/dbEnv.js';

export default defineConfig({
  out: './drizzle/guild',
  schema: './src/db/guild/schema.ts',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: dbEnv.TURSO_TEMPLATE_DB_URL,
    authToken: dbEnv.TURSO_GROUP_TOKEN,
  },
});
