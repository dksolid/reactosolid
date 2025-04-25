import fs from 'fs';
import path from 'path';

import { paths } from '../paths';

const sizes: Record<string, { raw?: string; gz?: string; br?: string }> = {};

function formatBytes(size: number) {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return `${(size / 1000).toFixed(2)} kb`;
}

function setSizes(fileName: string, target: { raw?: string; gz?: string; br?: string }) {
  const size = fs.statSync(path.resolve(paths.build, fileName)).size;

  if (fileName.endsWith('.js') || fileName.endsWith('.css')) target.raw = formatBytes(size);

  if (fileName.endsWith('.br')) target.br = formatBytes(size);

  if (fileName.endsWith('.gz')) target.gz = formatBytes(size);
}

export function showResultSizes() {
  // @ts-ignore
  fs.readdirSync(paths.build, { recursive: true }).forEach((fileName: string) => {
    if (fileName.includes('.txt') || fileName.includes('.map')) return;

    if (fileName.includes('.js') || fileName.includes('.css')) {
      sizes[fileName] ??= {};

      setSizes(fileName, sizes[fileName]);
    }
  });

  // eslint-disable-next-line no-console
  console.log(sizes);
}
