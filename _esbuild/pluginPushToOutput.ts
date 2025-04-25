import path from 'path';
import fs from 'node:fs';

import { OutputFile, Plugin } from 'esbuild';

import { paths } from '../paths';

export const pluginPushToOutput = (): Plugin => {
  return {
    name: 'custom-load',
    setup(build) {
      let customOutputs: Array<OutputFile> = [];

      // eslint-disable-next-line consistent-return
      build.onResolve({ filter: /\?/ }, (args) => {
        const [filePath, search] = args.path.split('?');

        const searchObject = new URLSearchParams(search);

        if (searchObject.get('copy') !== 'true' || !searchObject.get('extension')) return;

        // eslint-disable-next-line consistent-return
        return {
          path: path.resolve(args.resolveDir, `${filePath}.${searchObject.get('extension')}`),
          namespace: 'copy',
        };
      });

      build.onLoad({ filter: /.*/, namespace: 'copy' }, async (args) => {
        const contents = fs.readFileSync(args.path, 'utf-8');

        customOutputs.push({
          path: path.resolve(paths.build, path.parse(args.path).base),
          hash: path.parse(args.path).base,
          contents: Buffer.from(contents),
          text: contents,
        });

        return { contents: '', loader: 'js' };
      });

      build.onEnd(async (result) => {
        if (!result.outputFiles) return;

        result.outputFiles.push(...customOutputs);

        customOutputs = [];
      });
    },
  };
};
