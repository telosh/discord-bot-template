import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/control',
  schema: './src/db/control/schema.ts',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.CONTROL_DB_URL ?? 'file:./data/control.db',
    authToken: process.env.CONTROL_DB_TOKEN,
  },
});
