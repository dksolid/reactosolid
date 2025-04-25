import path from 'path';
import fs from 'fs';

import betterSpawn from 'better-spawn';
import { green } from 'colorette';
import { compareEnvFiles } from 'dk-compare-env';
import { generateFiles } from 'dk-file-generator';
import esbuild, { BuildContext } from 'esbuild';
import { runManual } from 'dk-reload-server';

import { env } from '../env';
import { paths } from '../paths';
import { generatorConfigs } from '../generator/generator.config';

import { configServer } from './configServer';
import { configClient } from './configClient';
import { showResultSizes } from './showResultSizes';
import { logBuildTime } from './logBuildTime';

process.title = 'node: Esbuild builder';

/**
 * @docs: https://github.com/paulpflug/better-spawn
 * @docs: https://github.com/fgnass/node-dev
 *
 */

let serverProcess: ReturnType<typeof betterSpawn>;
let reloadServerProcess: ReturnType<typeof betterSpawn>;
let sendReload: (() => void) | undefined;

function afterFirstBuild() {
  showResultSizes();

  /**
   * Start server & proxy it's stdout/stderr to current console
   *
   */

  if (!env.START_SERVER_AFTER_BUILD) return;

  const SERVER_LOG_PREFIX = green('[server]');

  serverProcess = betterSpawn(
    'node-dev --no-warnings --notify=false -r dotenv/config ./build/server.js',
    {
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  );

  serverProcess.stdout?.on('data', (msg: Buffer) => {
    // eslint-disable-next-line no-console
    console.log(SERVER_LOG_PREFIX, msg.toString().trim());
  });
  serverProcess.stderr?.on('data', (msg: Buffer) =>
    console.error(SERVER_LOG_PREFIX, msg.toString().trim())
  );

  /**
   * Start watch server & proxy it's stdout/stderr to current console
   * Also start files regeneration on change
   *
   */

  if (!env.HOT_RELOAD) return;

  const { sendReloadSignal } = runManual({
    port: env.HOT_RELOAD_PORT,
    https: env.HTTPS_BY_NODE,
    watchPaths: [paths.build],
  });

  sendReload = sendReloadSignal;
}

let serverContext: BuildContext;
let clientContext: BuildContext;

Promise.resolve()
  .then(() =>
    compareEnvFiles({
      paths: [
        path.resolve(paths.root, '.env'),
        path.resolve(paths.root, 'example.dev.env'),
        path.resolve(paths.root, 'example.prod.env'),
      ],
      parsedEnvKeys: Object.keys(env),
    })
  )
  .then(() =>
    generateFiles({
      configs: generatorConfigs,
      timeLogs: env.LOGS_GENERATION_DETAILS,
      timeLogsOverall: true,
      fileModificationLogs: true,
      watch:
        env.START_SERVER_AFTER_BUILD && env.HOT_RELOAD
          ? {
              paths: [paths.source],
              changedFilesLogs: true,
              aggregationTimeout: env.GENERATOR_AGGREGATION_TIMEOUT,
              onFinish: () => {
                void Promise.all([
                  logBuildTime({ name: 'server' }, serverContext.rebuild),
                  logBuildTime({ name: 'client' }, clientContext.rebuild),
                ]).then(() => {
                  sendReload?.();
                });
              },
            }
          : undefined,
    })
  )
  .then(() => {
    fs.rmSync(paths.build, { recursive: true, force: true });
    fs.mkdirSync(paths.build);
    fs.cpSync(path.resolve(paths.source, 'templates'), paths.build, {
      recursive: true,
      force: true,
    });
  })
  .then(() =>
    Promise.all([
      logBuildTime({ name: 'server' }, async () => {
        // eslint-disable-next-line no-restricted-syntax
        serverContext = await esbuild.context(configServer);
        // eslint-disable-next-line no-restricted-syntax
        await serverContext.rebuild();
      }),
      logBuildTime({ name: 'client' }, async () => {
        // eslint-disable-next-line no-restricted-syntax
        clientContext = await esbuild.context(configClient);
        // eslint-disable-next-line no-restricted-syntax
        await clientContext.rebuild();
      }),
    ])
  )

  .then(afterFirstBuild)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

if (env.START_SERVER_AFTER_BUILD) {
  process.on('exit', () => {
    if (serverProcess) serverProcess.close();
    // @ts-ignore
    if (reloadServerProcess) reloadServerProcess.close();

    void serverContext?.dispose();
    void clientContext?.dispose();
  });

  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));
}
