import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const guilds = sqliteTable('guilds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  dbUrl: text('db_url'),
  dbToken: text('db_token'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});
