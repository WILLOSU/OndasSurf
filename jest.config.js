/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { resolve } from 'path';

// 🔹 sobe um nível (raiz do projeto)
const root = resolve(__dirname, '..');

export default {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
};
