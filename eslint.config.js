import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import astro from 'eslint-plugin-astro';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'legacy-remix/**',
      'build/**',
      'specs/**',
      'prds/**',
      'coverage/**',
      '**/node_modules/**',
      '**/.astro/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      'public/**',
      '.netlify/**',
      '.vercel/**',
    ],
  },

  // Astro files configuration
  ...astro.configs['flat/recommended'],

  // JavaScript and TypeScript files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
      },
      'import/internal-regex': '^~/',
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/triple-slash-reference': [
        'error',
        { path: 'always', types: 'never', lib: 'never' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'no-undef': 'off', // TypeScript handles this better
      'no-redeclare': 'off', // TypeScript handles this better
      '@typescript-eslint/no-redeclare': 'error',

      // Import rules
      'import/no-unresolved': ['error', { ignore: ['^astro:', '^@/'] }],
    },
  },

  // TypeScript files only
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // TypeScript-specific overrides can go here
    },
  },

  // Type declaration files - allow triple slash references
  {
    files: ['src/env.d.ts', 'vitest.config.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // Test files - allow userEvent default import and add vitest globals
  {
    files: ['tests/**/*.test.tsx', 'tests/**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        // Vitest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      'import/no-named-as-default': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },

  // Prettier must be last to override other formatting rules
  prettier,
];
