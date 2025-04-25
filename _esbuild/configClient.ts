/* eslint-disable @typescript-eslint/naming-convention */

import path from 'path';
import { parse } from 'node:path';

import { pluginWebpackAnalyzer } from '@espcom/esbuild-plugin-webpack-analyzer';
import { postcssModules, sassPlugin } from 'esbuild-sass-plugin';
import { BuildOptions } from 'esbuild';
import browserslist from 'browserslist';
// @ts-ignore
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';
import {
  pluginReplace,
  modifierDirname,
  modifierFilename,
  modifierMobxObserverFC,
} from '@espcom/esbuild-plugin-replace';
import { pluginInjectPreload } from '@espcom/esbuild-plugin-inject-preload';
import { pluginPerf } from '@espcom/esbuild-plugin-perf';
import { pluginCompress } from '@espcom/esbuild-plugin-compress';
import { transformAsync } from '@babel/core';
import solid from 'babel-preset-solid';
import ts from '@babel/preset-typescript';

import { excludeFalsy } from 'utils/excludeFalsy';

import { env } from '../env';
import { paths } from '../paths';
import tsconfig from '../tsconfig.json';

import { pluginPushToOutput } from './pluginPushToOutput';

export const configClient: BuildOptions = {
  entryPoints: ['src/client.tsx'],
  bundle: true,
  logLevel: 'debug',
  format: env.CODE_SPLITTING ? 'esm' : 'iife',
  publicPath: '/',
  entryNames: env.FILENAME_HASH || env.CODE_SPLITTING ? '[ext]/[name]-[hash]' : '[ext]/[name]',
  assetNames: env.FILENAME_HASH || env.CODE_SPLITTING ? '[ext]/[name]-[hash]' : '[ext]/[name]',
  chunkNames: env.FILENAME_HASH || env.CODE_SPLITTING ? '[ext]/[name]-[hash]' : '[ext]/[name]',
  outdir: paths.build,
  write: false,
  metafile: true,
  minify: env.MINIMIZE_CLIENT,
  keepNames: true,
  splitting: env.CODE_SPLITTING,
  treeShaking: true,
  sourcemap: 'linked',
  legalComments: 'external',
  platform: 'browser',
  // https://github.com/nihalgonsalves/esbuild-plugin-browserslist
  target: resolveToEsbuildTarget(browserslist(), { printUnknownTargets: false }),
  define: {
    IS_CLIENT: JSON.stringify(true),
    process: JSON.stringify({
      env: {
        NODE_ENV: env.NODE_ENV,
        FRAMEWORK_MODE: env.FRAMEWORK_MODE,
      },
    }),
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
    PATH_SEP: JSON.stringify(path.sep),
  },
  conditions: [env.NODE_ENV],
  resolveExtensions: ['.js', '.ts', '.tsx'],
  loader: {
    '.svg': 'text',
    '.png': 'file',
    '.gif': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
  },
  alias:
    env.FRAMEWORK_MODE === 'preact'
      ? Object.entries(tsconfig.compilerOptions.paths).reduce(
          (acc, [namePackage, nameSubstituteArr]) => {
            if (namePackage !== '*') {
              acc[namePackage] = nameSubstituteArr[0];
            }

            return acc;
          },
          {} as any
        )
      : undefined,
  plugins: [
    env.BUILD_MEASURE && pluginPerf(),

    pluginReplace(
      [
        modifierDirname({ filter: /\.tsx?$/ }),
        modifierFilename({ filter: /\.tsx?$/ }),
        env.FRAMEWORK_MODE === 'solid'
          ? {
              filter: /\.tsx?$/,
              replace: /.*/gs,
              replacer(onLoadArgs) {
                return async (source) => {
                  // eslint-disable-next-line no-restricted-syntax
                  const result = await transformAsync(source, {
                    presets: [[solid], [ts]],
                    filename: parse(onLoadArgs.path).base,
                    sourceMaps: 'inline',
                  });

                  if (result?.code == null) {
                    throw new Error('No result was provided from Babel');
                  }

                  return result.code;
                };
              },
            }
          : (null as any),
        env.FRAMEWORK_MODE === 'react' || env.FRAMEWORK_MODE === 'preact'
          ? modifierMobxObserverFC({ filter: /\.tsx?$/ })
          : (null as any),
      ].filter((mod) => mod != null)
    ),

    // https://github.com/glromeo/esbuild-sass-plugin
    sassPlugin({ filter: /global\.scss$/, type: 'css', loadPaths: [paths.styles] }),
    sassPlugin({
      filter: /\.scss$/i,
      type: 'css',
      loadPaths: [paths.styles],

      // https://github.com/madyankin/postcss-modules
      transform: postcssModules({ generateScopedName: '[path][local]' }),
    }),

    pluginInjectPreload([
      {
        templatePath: path.resolve(paths.build, 'template.html'),
        replace: '<!-- ENTRY_CSS --><!-- /ENTRY_CSS -->',
        // eslint-disable-next-line consistent-return
        as(filePath) {
          if (/client([^.]+)?\.css$/.test(filePath)) {
            return `<link rel="stylesheet" type="text/css" href="${filePath}" />`;
          }
        },
      },
      {
        templatePath: path.resolve(paths.build, 'template.html'),
        replace: '<!-- ENTRY_JS --><!-- /ENTRY_JS -->',
        // eslint-disable-next-line consistent-return
        as(filePath) {
          if (/client([^.]+)?\.js$/.test(filePath)) {
            if (env.CODE_SPLITTING) {
              return `<script src="${filePath}" type="module"></script>`;
            }

            return `<script src="${filePath}" defer=""></script>`;
          }
        },
      },
    ]),

    pluginPushToOutput(),

    pluginCompress({
      gzip: env.GENERATE_COMPRESSED,
      brotli: env.GENERATE_COMPRESSED,
      zstd: env.GENERATE_COMPRESSED,
      level: 'high',
      extensions: ['.js', '.css'],
    }),

    env.BUNDLE_ANALYZER &&
      pluginWebpackAnalyzer({
        port: env.BUNDLE_ANALYZER_PORT,
        open: false,
      }),
  ].filter(excludeFalsy),
};
