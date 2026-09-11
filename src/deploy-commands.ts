import { REST, Routes } from 'discord.js';
import { env } from './config/env.js';
import { loadCommands } from './discord/loader.js';
import { logger } from './infra/logger.js';

const isGlobal = process.argv.includes('--global');

async function deploy(): Promise<void> {
  const commands = await loadCommands();
  const body = commands.map((c) => c.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

  if (isGlobal) {
    logger.info({ count: body.length }, 'Deploying global commands');
    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body });
    logger.info('Global commands deployed (can take up to 1 hour)');
  } else if (env.DISCORD_GUILD_ID) {
    logger.info({ guild: env.DISCORD_GUILD_ID, count: body.length }, 'Deploying guild commands');
    await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID),
      { body },
    );
    logger.info('Guild commands deployed');
  } else {
    console.error('Set DISCORD_GUILD_ID or use --global');
    process.exit(1);
  }
}

void deploy().catch((error) => {
  logger.error({ error }, 'Deploy failed');
  process.exit(1);
});
