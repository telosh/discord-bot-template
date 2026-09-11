import { env } from '../config/env.js';

export function isAdmin(userId: string): boolean {
  if (env.adminUserIds.length === 0) return false;
  return env.adminUserIds.includes(userId);
}

export function isAllowedChannel(channelId: string): boolean {
  if (env.allowedChannelIds.length === 0) return true;
  return env.allowedChannelIds.includes(channelId);
}
