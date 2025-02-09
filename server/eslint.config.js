import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import airbnbBase from 'eslint-config-airbnb-base';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...airbnbBase.rules,
      ...importPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': 'off',
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'max-len': ['error', { code: 100, ignoreUrls: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js'],
        },
      },
    },
  },
];
