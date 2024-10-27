module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './src',
  testRegex: '.*\\.(test|spec)\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/../tsconfig.test.json'
    }
  },
  collectCoverageFrom: ['**/*.{ts,js}', '!**/node_modules/**', '!**/vendor/**'],
  coverageDirectory: '../coverage'
};
