import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const DbEnvSchema = z.object({
  CONTROL_DB_URL: z.string().default('file:./data/control.db'),
  CONTROL_DB_TOKEN: z.string().optional(),
  TURSO_TEMPLATE_DB_URL: z.string().default('file:./data/template-guild.db'),
  TURSO_GROUP_TOKEN: z.string().optional(),
});

export type DbEnv = z.infer<typeof DbEnvSchema>;

function loadDbEnv(): DbEnv {
  const parsed = DbEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Database environment variables are invalid:');
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }
  return parsed.data;
}

export const dbEnv: DbEnv = loadDbEnv();
