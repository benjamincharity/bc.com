module.exports = {
  ignorePatterns: ['**/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'array-bracket-newline': ['error', 'consistent'],
        'array-bracket-spacing': ['error', 'never'],
        'array-element-newline': ['error', 'consistent'],
        'arrow-body-style': ['error', 'as-needed'],
        'arrow-parens': ['error', 'as-needed'],
        'arrow-spacing': 'error',
        'brace-style': 'error',
        'comma-dangle': ['error', 'always-multiline'],
        'dot-location': ['error', 'property'],
        'no-else-return': 'error',
        'no-lone-blocks': 'error',
        'no-lonely-if': 'error',
        'no-multiple-empty-lines': [
          'warn',
          {
            max: 2,
            maxEOF: 1,
          },
        ],
        'no-unneeded-ternary': 'warn',
        'no-unused-vars': 'warn',
        'object-curly-newline': ['error', { consistent: true }],
        'object-curly-spacing': ['error', 'always'],
        'object-property-newline': 'error',
        'object-shorthand': ['error', 'always'],
        'one-var': ['error', 'never'],
        'prefer-object-spread': 'error',
        'prefer-template': 'error',
        'quote-props': ['warn', 'consistent-as-needed'],
        'space-before-blocks': 'warn',
        '@angular-eslint/no-host-metadata-property': 'off',

        '@nrwl/nx/enforce-module-boundaries': [
          'error',
          {
            allow: [],
            depConstraints: [
              {
                onlyDependOnLibsWithTags: ['*'],
                sourceTag: '*',
              },
            ],
            enforceBuildableLibDependency: true,
          },
        ],
        'import/order': [
          'warn',
          {
            groups: [
              ['builtin', 'external'],
              ['internal', 'parent', 'sibling', 'index'],
            ],
            pathGroups: [
              {
                pattern: '@bc/**/*',
                group: 'external',
                position: 'after',
              },
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
      },
    },
    {
      extends: ['plugin:@nrwl/nx/typescript'],
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      extends: ['plugin:@nrwl/nx/javascript'],
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
  plugins: ['@nrwl/nx', 'import'],
  root: true,
};
