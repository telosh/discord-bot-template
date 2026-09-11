import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required'),
  DISCORD_CLIENT_ID: z.string().min(1, 'DISCORD_CLIENT_ID is required'),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  DISCORD_GUILD_ID: z.string().optional(),
  ADMIN_USER_IDS: z.string().optional(),
  ALLOWED_CHANNEL_IDS: z.string().optional(),

  OAUTH_REDIRECT_URI: z.string().url().optional(),
  SESSION_SECRET: z.string().optional(),
  WEB_BASE_URL: z.string().url().optional(),

  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  NODE_ENV: z.string().default('development'),
});

export type RawEnv = z.infer<typeof EnvSchema>;

export interface Env extends RawEnv {
  adminUserIds: string[];
  allowedChannelIds: string[];
}

function parseCsv(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

class ConfigError extends Error {
  constructor(public readonly issues: Array<{ path: string[]; message: string }>) {
    super(`Environment variables are invalid: ${issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`);
    this.name = 'ConfigError';
  }
}

function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({ path: issue.path.map(String), message: issue.message }));
    throw new ConfigError(issues);
  }
  const raw = parsed.data;
  return {
    ...raw,
    adminUserIds: parseCsv(raw.ADMIN_USER_IDS),
    allowedChannelIds: parseCsv(raw.ALLOWED_CHANNEL_IDS),
  };
}

export const env: Env = loadEnv();
