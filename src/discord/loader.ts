import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Collection } from 'discord.js';
import { isCommand, type Command } from './command.js';
import { isContextMenuCommand, type ContextMenuCommand } from './contextMenu.js';
import { logger } from '../infra/logger.js';

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const [subDirs, files] = entries.reduce<[string[], string[]]>(
    ([dirs, files], entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) dirs.push(full);
      else files.push(full);
      return [dirs, files];
    },
    [[], []],
  );

  const nested = await Promise.all(subDirs.map(walk));
  return [...files, ...nested.flat()];
}

async function loadFromFiles<T>(
  files: string[],
  key: 'command' | 'contextMenu',
  isValid: (v: unknown) => v is T,
  getName: (v: T) => string,
): Promise<Collection<string, T>> {
  const collection = new Collection<string, T>();
  const toImport: string[] = [];

  for (const file of files) {
    if (
      (file.endsWith('.ts') || file.endsWith('.js')) &&
      !file.endsWith('.d.ts') &&
      !file.endsWith('.test.ts')
    ) {
      toImport.push(file);
    }
  }

  const results = await Promise.all(
    toImport.map(async (file) => {
      const mod = (await import(pathToFileURL(file).href)) as Record<string, unknown>;
      return { file, candidate: mod[key] ?? mod['default'] };
    }),
  );

  for (const { file, candidate } of results) {
    if (!isValid(candidate)) {
      if (key === 'command') logger.warn({ file }, 'Skipped invalid command file');
      continue;
    }
    const name = getName(candidate);
    if (collection.has(name)) {
      throw new Error(`Duplicate ${key} name: ${name} (${file})`);
    }
    collection.set(name, candidate);
  }

  return collection;
}

export async function loadCommands(): Promise<Collection<string, Command>> {
  const base = join(dirname(fileURLToPath(import.meta.url)), '..', 'commands');
  const files = await walk(base);
  return loadFromFiles(
    files,
    'command',
    isCommand,
    (c) => c.data.name,
  );
}

export async function loadContextMenus(): Promise<Collection<string, ContextMenuCommand>> {
  const base = join(dirname(fileURLToPath(import.meta.url)), '..', 'context-menus');
  const files = await walk(base).catch(() => [] as string[]);
  return loadFromFiles(
    files,
    'contextMenu',
    isContextMenuCommand,
    (m) => m.data.name,
  );
}
