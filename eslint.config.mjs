/* eslint-disable @typescript-eslint/naming-convention */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs';

// eslint-disable-next-line import/no-unresolved
import { defineConfig, globalIgnores } from 'eslint/config';
// import react from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';
import globals from 'globals';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

const pathGroups = [
  { pattern: 'env', group: 'internal' },
  { pattern: 'paths', group: 'internal' },
];

fs.readdirSync(path.resolve(__dirname, 'src')).forEach((fileName) => {
  const fileNameNoExt = path.parse(fileName).name;

  pathGroups.push({ pattern: fileNameNoExt, group: 'internal' });
  pathGroups.push({ pattern: `${fileNameNoExt}/**`, group: 'internal' });
});

// eslint-disable-next-line no-restricted-syntax
export default defineConfig([
  globalIgnores(['src/externalScripts/', 'build/']),
  importPlugin.flatConfigs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  { linterOptions: { reportUnusedDisableDirectives: 'off' } },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    // plugins: { react },
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      //  react: { pragma: 'React', version: 'detect' },
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: path.resolve(__dirname, 'tsconfig.json') },
      },
    },

    rules: {
      yoda: 'error',
      radix: 'error',
      strict: 'off',
      'no-new': 'error',
      'no-var': 'error',
      'no-eval': 'error',
      'no-with': 'error',
      'new-cap': 'error',
      'no-tabs': 'error',
      'no-alert': 'error',
      'no-octal': 'error',
      'no-proto': 'error',
      'no-empty': 'error',
      'no-caller': 'error',
      'no-labels': 'error',
      'use-isnan': 'error',
      'func-names': 'error',
      'new-parens': 'error',
      'no-bitwise': 'error',
      'wrap-regex': 'off',
      'no-iterator': 'error',
      'no-new-func': 'error',
      'vars-on-top': 'error',
      'no-debugger': 'error',
      'default-case': 'error',
      'dot-notation': 'error',
      'guard-for-in': 'error',
      'no-div-regex': 'error',
      'no-loop-func': 'error',
      'no-multi-str': 'error',
      'no-sequences': 'error',
      'no-ex-assign': 'error',
      'no-obj-calls': 'error',
      'no-lonely-if': 'error',
      'no-extra-bind': 'error',
      'no-script-url': 'error',
      'prefer-spread': 'error',
      'no-new-object': 'error',
      'no-delete-var': 'error',
      'no-undef-init': 'error',
      'accessor-pairs': 'error',
      'no-else-return': 'error',
      'no-fallthrough': 'error',
      'no-lone-blocks': 'error',
      'no-self-assign': 'error',
      'no-process-env': 'error',
      'no-func-assign': 'error',
      'no-implied-eval': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-self-compare': 'error',
      'no-useless-call': 'error',
      'no-class-assign': 'error',
      'prefer-template': 'error',
      'no-regex-spaces': 'error',
      'no-multi-assign': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'no-empty-pattern': 'error',
      'no-extend-native': 'error',
      'no-global-assign': 'error',
      'no-return-assign': 'error',
      'no-throw-literal': 'error',
      'no-await-in-loop': 'error',
      'no-control-regex': 'error',
      'no-sparse-arrays': 'error',
      'consistent-return': 'error',
      'no-param-reassign': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'constructor-super': 'error',
      'no-useless-rename': 'error',
      'no-duplicate-case': 'error',
      'no-invalid-regexp': 'error',
      'no-unsafe-finally': 'error',
      'no-nested-ternary': 'error',
      'no-confusing-arrow': 'off',
      'prefer-rest-params': 'error',
      'no-unsafe-negation': 'error',
      'no-mixed-operators': 'error',
      'no-floating-decimal': 'error',
      'no-implicit-globals': 'off',
      'no-compare-neg-zero': 'error',
      'no-unneeded-ternary': 'error',
      'no-case-declarations': 'error',
      'no-implicit-coercion': 'error',
      'no-duplicate-imports': 'error',
      'array-callback-return': 'error',
      'no-unused-expressions': 'error',
      'no-constant-condition': 'error',
      'no-extra-boolean-cast': 'error',
      'no-inner-declarations': 'error',
      'no-useless-constructor': 'error',
      'lines-around-directive': 'error',
      'no-useless-computed-key': 'error',
      'prefer-numeric-literals': 'error',
      'no-unexpected-multiline': 'error',
      'no-empty-character-class': 'error',
      'no-shadow-restricted-names': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'prefer-promise-reject-errors': 'error',

      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'one-var': ['error', 'never'],
      'id-match': ['error', '[a-zA-Z0-9_]+$'],
      'wrap-iife': ['error', 'inside'],
      'max-depth': ['error', { max: 4 }],
      'jsx-quotes': ['error', 'prefer-double'],
      'max-params': ['error', { max: 3 }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'dot-location': ['error', 'property'],
      'prefer-const': ['error', { destructuring: 'all' }],
      'spaced-comment': ['error', 'always'],
      'no-cond-assign': ['error', 'always'],
      'object-shorthand': ['error', 'always', { avoidQuotes: true }],
      'func-name-matching': ['error', 'never'],
      'no-underscore-dangle': ['error', { allowAfterThis: true }],
      'max-nested-callbacks': ['error', { max: 4 }],
      'prefer-destructuring': ['error', { array: false, object: false }], // ?
      'no-restricted-imports': ['error', { patterns: ['lodash/*'] }],
      'generator-star-spacing': ['error', { before: false, after: true }],
      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
      'nonblock-statement-body-position': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration[async=true]',
          message: 'Using async functions is restricted. Use Promise. ',
        },
        {
          selector: 'FunctionDeclaration[generator=true]',
          message: 'Using generator functions is restricted. Use Promise. ',
        },
        {
          selector: 'AwaitExpression',
          message: 'Using await construction is restricted. Use Promise. ',
        },
        {
          selector: 'YieldExpression',
          message: 'Using yield construction is restricted. Use Promise. ',
        },
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Prefer named exports',
        },
      ],

      'import/no-named-as-default': 'off',
      'import/first': 'error',
      'import/no-absolute-path': 'error',
      'import/no-mutable-exports': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index'],
          pathGroups,
          pathGroupsExcludedImportTypes: ['internal'],
        },
      ],
      'import/no-restricted-paths': [
        'error',
        { basePath: __dirname, zones: [{ target: '../src', from: '../server' }] },
      ],

      'prettier/prettier': [
        'warn',
        {
          semi: true,
          tabWidth: 2,
          proseWrap: 'never',
          printWidth: 100,
          arrowParens: 'always',
          singleQuote: true,
          trailingComma: 'es5',
          bracketSpacing: true,
          bracketSameLine: false,
        },
      ],
      'import/named': 'off',
      'import/no-default-export': 'off',
      //
      // 'react/no-typos': 'error',
      // 'react/no-set-state': 'error',
      // 'react/jsx-no-undef': 'error',
      // 'react/no-deprecated': 'error',
      // 'react/button-has-type': 'error',
      // 'react/no-unused-state': 'error',
      // 'react/no-children-prop': 'error',
      // 'react/no-find-dom-node': 'error',
      // 'react/no-unknown-property': 'error',
      // 'react/jsx-no-target-blank': 'error',
      // 'react/require-render-return': 'error',
      // 'react/no-unescaped-entities': 'error',
      // 'react/jsx-no-duplicate-props': 'error',
      // 'react/jsx-no-useless-fragment': 'error',
      // 'react/jsx-no-comment-textnodes': 'error',
      // 'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      // 'react/jsx-no-bind': ['error', { ignoreRefs: true, allowArrowFunctions: true }],
      // 'react/jsx-fragments': ['error', 'syntax'],
      // 'react/no-string-refs': ['error', { noTemplateLiterals: true }],
      // 'react/forbid-elements': ['error', { forbid: [{ element: 'button' }] }],
      // 'react/prefer-es6-class': ['error', 'always'],
      // 'react/jsx-boolean-value': ['error', 'never'],
      // 'react/self-closing-comp': ['error', { component: true, html: true }],
      // 'react/jsx-curly-brace-presence': ['error', { props: 'always', children: 'never' }],
      // 'react/jsx-no-literals': [
      //   'error',
      //   { noStrings: true, ignoreProps: true, noAttributeStrings: true },
      // ],
      // 'react/function-component-definition': [
      //   'error',
      //   {
      //     namedComponents: 'function-declaration',
      //   },
      // ],
      //
      // 'react/no-unused-prop-types': 'off',
      // 'react/jsx-handler-names': 'off',
      'import/no-unresolved': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignoreTypeIndexes: true,
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignore: [-1, 0, 1, 2],
        },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['PascalCase', 'camelCase', 'UPPER_CASE', 'snake_case'],
          filter: {
            regex: '^(__html|__filename|__dirname|_)$',
            match: false,
          },
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          prefix: ['Type', 'Props'],
          filter: {
            regex: '^(ViewModel)$',
            match: false,
          },
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
          modifiers: ['requiresQuotes'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'function',
          format: ['PascalCase', 'camelCase'],
        },
      ],
    },
  },
  {
    files: ['src/api/*'],
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/api',
              from: './src',
              except: ['models'],
            },
          ],
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'models',
              message: 'Use specific imports like "../models/SomeModel"',
            },
          ],

          patterns: [
            {
              group: ['models/*', '!../models/*'],
              message: 'Use a relative import for validators generator',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/models/**/*'],

    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/models',
              from: './src',
              except: ['models'],
            },
          ],
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'models',
              message: 'Use specific imports like "../models/SomeModel"',
            },
          ],

          patterns: [
            {
              group: ['models/*', '!../models/*'],
              message: 'Use a relative import',
            },
          ],
        },
      ],
    },
  },
]);
