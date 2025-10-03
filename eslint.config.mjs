import nextPlugin from '@next/eslint-plugin-next';
import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import stylistic from '@stylistic/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import eslintCompat from 'eslint-plugin-compat';
import reactCompilerPlugin from 'eslint-plugin-react-compiler';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import path from 'node:path';
import pluginQuery from '@tanstack/eslint-plugin-query';
import nodePlugin from 'eslint-plugin-n';
import redosPlugin from 'eslint-plugin-redos-detector';

const eslintConfig = defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/expect-expect': 'warn',
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },
  eslintPluginUnicorn.configs.recommended,
  {
    settings: {
      'import/resolver': {
        typescript: true,
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/catch-error-name': 'off',
      '@typescript-eslint/no-deprecated': 'error',
      'unicorn/no-useless-undefined': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
  stylistic.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: path.resolve(import.meta.dirname, 'tsconfig.json'),
      },
    },
  },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  ...pluginQuery.configs['flat/recommended'],
  {
    ...jsxA11y.flatConfigs.recommended,
    files: ['src/**/*.tsx'],
  },
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-compiler': reactCompilerPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-compiler/react-compiler': 'error',
    },
  },
  {
    ...testingLibraryPlugin.configs['flat/react'],
    files: ['tests/**/*.test.tsx'],
  },
  jestDomPlugin.configs['flat/recommended'],
  {
    ...eslintCompat.configs['flat/recommended'],
    ignores: [
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
      'src/lib/actions/**/*.ts',
      'src/app/**/route.ts',
      'src/app/**/page.tsx',
    ],
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    ignores: [
      'src/app/**/page.tsx',
      'src/app/**/layout.tsx',
      'src/app/**/error.tsx',
      'src/app/**/loading.tsx',
      'src/app/**/route.ts',
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
      'src/lib/models/seed.ts',
    ],
    rules: {
      'import/no-unused-modules': [
        'error',
        { unusedExports: true, missingExports: true },
      ],
    },
  },
  {
    files: ['src/**/*.tsx'],
    rules: {
      'react/display-name': 'off',
      'react/jsx-boolean-value': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-fragments': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/no-unused-prop-types': 'error',
      'react/self-closing-comp': 'error',
      'react/void-dom-elements-no-children': 'error',
      'react/jsx-pascal-case': [
        'error',
        {
          allowNamespace: true,
        },
      ],
      'react/button-has-type': 'error',
      'react/iframe-missing-sandbox': 'error',
      'react/jsx-no-leaked-render': 'error',
      'react/no-object-type-as-default-prop': 'error',
    },
  },
  {
    files: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'compat/compat': 'off',
    },
  },
  {
    ...nodePlugin.configs['flat/recommended'],
    files: ['src/**/*.route.ts', 'src/lib/actions/**/*.ts'],
  },
  {
    files: ['src/**/*.route.ts', 'src/lib/actions/**/*.ts'],
    plugins: {
      'redos-detector': redosPlugin,
    },
    rules: {
      'redos-detector/no-unsafe-regex': 'error',
      '@typescript-eslint/no-base-to-string': 'off',
      'n/no-missing-import': 'off',
      'n/no-extraneous-import': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      '**/*.d.ts',
      '*.config.*',
      'vitest.server.setup.ts',
      'vitest.client.setup.ts',
      'vitest.server.global-setup.ts',
      'vitest.config.ts',
      'eslint.config.*',
      'next.config.*',
    ],
  },
  eslintPluginPrettierRecommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: false },
      ],
    },
  },
]);

export default eslintConfig;
