import { green, yellow } from 'colorette';

import { env } from '../env';

// eslint-disable-next-line no-restricted-syntax
export async function logBuildTime(params: { name: string }, cb: any) {
  const LOG_PREFIX = green('[ESBUILD]');
  const time = performance.now();
  const watch = env.START_SERVER_AFTER_BUILD && env.HOT_RELOAD;

  // eslint-disable-next-line no-console
  console.log(`${LOG_PREFIX} Started ${watch ? 'watching' : 'building'} ${yellow(params.name)}`);

  // eslint-disable-next-line no-restricted-syntax
  await cb();
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const buildTime = ((performance.now() - time) / 1000).toFixed(3);

  // eslint-disable-next-line no-console
  console.log(
    `${LOG_PREFIX} finished building ${yellow(params.name)} within ${yellow(buildTime)} seconds`
  );
}
