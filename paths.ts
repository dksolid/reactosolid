import path from 'path';

const root = __dirname;
const source = path.resolve(root, 'src');

export const paths = {
  root,
  source,
  stats: path.resolve(root, 'stats'),
  env: path.resolve(root, 'env.ts'),
  build: path.resolve(root, 'build'),
  pages: path.resolve(source, 'pages'),
  paths: path.resolve(root, 'paths.ts'),
  utils: path.resolve(source, 'utils'),
  assets: path.resolve(source, 'assets'),
  styles: path.resolve(source, 'styles'),
  models: path.resolve(source, 'models'),
  themes: path.resolve(source, 'styles/themes.scss'),
  global: path.resolve(source, 'styles/global.scss'),
  package: path.resolve(root, 'package.json'),
  actions: path.resolve(source, 'actions'),
  validators: path.resolve(source, 'validators'),
  nodeModules: path.resolve(root, 'node_modules'),
  clientEntry: path.resolve(source, 'client.tsx'),
  serverEntry: path.resolve(root, 'server/server.ts'),
  themesObject: path.resolve(source, 'const/themes.tsx'),
};
