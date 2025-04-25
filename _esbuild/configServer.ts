import path from 'path';

import { BuildOptions } from 'esbuild';
import { modifierDirname, modifierFilename, pluginReplace } from '@espcom/esbuild-plugin-replace';
import { pluginPerf } from '@espcom/esbuild-plugin-perf';

import { excludeFalsy } from 'utils/excludeFalsy';

import { env } from '../env';

export const configServer: BuildOptions = {
  entryPoints: ['src/server.tsx'],
  bundle: true,
  metafile: true,
  treeShaking: true,
  sourcemap: false,
  outdir: 'build/',
  platform: 'node',
  minify: env.MINIMIZE_SERVER,
  logLevel: 'warning',
  legalComments: 'external',
  packages: 'external',
  target: 'node22',
  define: {
    IS_CLIENT: 'false',
    PATH_SEP: JSON.stringify(path.sep),
  },
  plugins: [
    env.BUILD_MEASURE_SERVER && pluginPerf(),

    pluginReplace([
      modifierDirname({ filter: /\.tsx?$/ }),
      modifierFilename({ filter: /\.tsx?$/ }),
    ]),
  ].filter(excludeFalsy),
};
