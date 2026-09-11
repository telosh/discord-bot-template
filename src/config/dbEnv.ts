import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../infra/logger.js';

dotenv.config();

const DbEnvSchema = z.object({
  CONTROL_DB_URL: z.string().default('file:./data/control.db'),
  CONTROL_DB_TOKEN: z.string().optional(),
  TURSO_TEMPLATE_DB_URL: z.string().default('file:./data/template-guild.db'),
  TURSO_GROUP_TOKEN: z.string().optional(),
});

export type DbEnv = z.infer<typeof DbEnvSchema>;

class DbConfigError extends Error {
  constructor(public readonly issues: Array<{ path: string[]; message: string }>) {
    super(`Database environment variables are invalid: ${issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`);
    this.name = 'DbConfigError';
  }
}

function loadDbEnv(): DbEnv {
  const parsed = DbEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({ path: issue.path.map(String), message: issue.message }));
    throw new DbConfigError(issues);
  }
  return parsed.data;
}

export const dbEnv: DbEnv = loadDbEnv();

function redactAuthToken(url: string): string {
  try {
    const u = new URL(url);
    if (u.searchParams.has('authToken')) {
      u.searchParams.set('authToken', '***');
    }
    return u.toString();
  } catch {
    return url;
  }
}

logger.info(
  {
    controlDbUrl: redactAuthToken(dbEnv.CONTROL_DB_URL),
    templateDbUrl: redactAuthToken(dbEnv.TURSO_TEMPLATE_DB_URL),
  },
  'Database configuration loaded',
);
