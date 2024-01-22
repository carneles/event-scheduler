export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts',
    '!src/server.ts',
    '!src/init.ts',
    '!src/env.ts',
  ],
  coveragePathIgnorePatterns: ['node_modules', 'src/database', 'src/test', 'src/types'],
  reporters: ['default'],
  globals: { 'ts-jest': { diagnostics: false } },
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      tsConfig: 'tsconfig.json'
    }]
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};