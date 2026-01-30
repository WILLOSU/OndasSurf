/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { resolve } from 'path';
const root = resolve(__dirname); // Pega a raiz onde o arquivo está

export const rootDir = root;
export const displayName = 'root-tests';
export const testMatch = ['<rootDir>/src/**/*.test.ts'];
export const testEnvironment = 'node';
export const clearMocks = true;
export const preset = 'ts-jest';
export const moduleNameMapper = {
  // O mapeamento deve bater exatamente com o seu tsconfig.json
  '^@src/(.*)$': '<rootDir>/src/$1',
  '^@test/(.*)$': '<rootDir>/test/$1',
};