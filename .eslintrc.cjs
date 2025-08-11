module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],

  ignorePatterns: ['dist/**', 'node_modules/**'],
  overrides: [
    {
      files: ['src/**/*.{ts,mts,cts}'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        'import/extensions': [
          'error',
          'ignorePackages',
          { js: 'always', ts: 'never', mjs: 'always', mts: 'never' },
        ],
        'import/no-unresolved': 'off',
        'import/order': [
          'warn',
          {
            'newlines-between': 'always',
            groups: [
              'builtin',
              'external',
              'internal',
              ['parent', 'sibling', 'index'],
              'object',
              'type',
            ],
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.mts', '.cts'],
    },
    'import/resolver': {
      typescript: { project: './tsconfig.json' },
      node: { extensions: ['.js', '.mjs', '.ts', '.mts'] },
    },
  },
};
