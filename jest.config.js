export default {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__test__/**/*.test.ts'],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};