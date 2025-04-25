import fs from 'node:fs';
import path from 'node:path';

// eslint-disable-next-line no-process-env
const env = process.env;

const tsconfig = JSON.parse(fs.readFileSync(path.resolve('./tsconfig.json'), 'utf8'));

if (env.FRAMEWORK_MODE === 'react') {
  tsconfig.compilerOptions.jsx = 'react-jsx';
  delete tsconfig.compilerOptions.jsxImportSource;
  tsconfig.compilerOptions.paths = { '*': ['*', 'src/*'] };

  fs.writeFileSync(path.resolve('./tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf-8');
  fs.writeFileSync(
    path.resolve('./src/compSystem/transformers/package.json'),
    '{ "types": "transformersMobx.tsx", "main": "transformersMobx.tsx" }',
    'utf-8'
  );
} else if (env.FRAMEWORK_MODE === 'solid') {
  tsconfig.compilerOptions.jsx = 'preserve';
  tsconfig.compilerOptions.jsxImportSource = 'solid-js';
  tsconfig.compilerOptions.paths = { '*': ['*', 'src/*'] };

  fs.writeFileSync(path.resolve('./tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf-8');
  fs.writeFileSync(
    path.resolve('./src/compSystem/transformers/package.json'),
    '{ "types": "transformersSolid.tsx", "main": "transformersSolid.tsx" }',
    'utf-8'
  );
} else if (env.FRAMEWORK_MODE === 'preact') {
  tsconfig.compilerOptions.jsx = 'react-jsx';
  tsconfig.compilerOptions.jsxImportSource = 'preact';
  Object.assign(tsconfig.compilerOptions.paths, {
    react: ['./node_modules/preact/compat/'],
    'react/jsx-runtime': ['./node_modules/preact/jsx-runtime'],
    'react-dom': ['./node_modules/preact/compat/'],
    'react-dom/*': ['./node_modules/preact/compat/*'],
    'mobx-react-lite': ['mobx-preact'],
  });

  fs.writeFileSync(path.resolve('./tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf-8');
  fs.writeFileSync(
    path.resolve('./src/compSystem/transformers/package.json'),
    '{ "types": "transformersPreact.tsx", "main": "transformersPreact.tsx" }',
    'utf-8'
  );
}
