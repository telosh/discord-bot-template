import { defineConfig } from 'drizzle-kit';
import { dbEnv } from './src/config/dbEnv.js';

export default defineConfig({
  out: './drizzle/control',
  schema: './src/db/control/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: dbEnv.CONTROL_DB_URL,
    authToken: dbEnv.CONTROL_DB_TOKEN,
  },
});
