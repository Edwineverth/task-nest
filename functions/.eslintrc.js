module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Integración de Prettier
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '/generated/**/*', // Ignore generated files.
  ],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  rules: {
    quotes: ['error', 'single'], // Cambiar a comillas simples
    'import/no-unresolved': 0,
    indent: ['error', 2],
    'require-jsdoc': 'off', // Desactiva la regla de JSDoc
    'new-cap': 'off', // Desactiva la regla para funciones con mayúscula
    'prettier/prettier': [
      'error',
      {
        singleQuote: true, // Comillas simples en Prettier
        semi: true,
        trailingComma: 'es5',
        printWidth: 80,
        tabWidth: 2,
      },
    ],
  },
};
