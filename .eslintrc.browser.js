module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: 'tsconfig.browser.json',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  env: {
    es6: true,
    node: true,
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      node: {
        moduleDirectory: [
          'node_modules',
          '../..',
          '.',
        ],
      },
    },
  },
  rules: {
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true, // Some places have dev deps imported where eslint complains.
      packageDir: ['.', '../..'],
    }],
    'import/no-unresolved': [2, { caseSensitive: false }],
    'max-len': ['error', { 'code': 100 }],
    'lines-between-class-members': 'off',
  }
};
