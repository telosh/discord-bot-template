import type { ContextMenuCommandInteraction } from 'discord.js';

export interface ContextMenuCommand {
  data: { name: string };
  execute(interaction: ContextMenuCommandInteraction): Promise<void>;
}

export function isContextMenuCommand(value: unknown): value is ContextMenuCommand {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['data'] === 'object' &&
    candidate['data'] !== null &&
    typeof (candidate['data'] as { name?: unknown }).name === 'string' &&
    typeof candidate['execute'] === 'function'
  );
}
