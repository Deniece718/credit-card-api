// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';

const ignores = ['**/*.js', 'dist/**', 'node_modules/**'];

export default defineConfig(
  {
    ...eslint.configs.recommended,
    ignores,
  },
  ...tseslint.configs.recommended.map((config) => ({ ...config, ignores })),
  jest.configs['flat/recommended'],
);
