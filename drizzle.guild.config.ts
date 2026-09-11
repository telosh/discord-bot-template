import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/guild',
  schema: './src/db/guild/schema.ts',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_TEMPLATE_DB_URL ?? 'file:./data/template-guild.db',
    authToken: process.env.TURSO_GROUP_TOKEN,
  },
});
