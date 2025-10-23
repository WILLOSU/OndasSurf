const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = { 
  ...rootConfig, 
  ...{
    rootDir: root,
    displayName: "end2end-tests", // de ponta a ponta
    setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"], // roda antes
    testMatch: ["<rootDir>/test/**/*.test.ts"], // arquivos que estão da pasta test
    moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/src/$1',
      '^@test/(.*)$': '<rootDir>/test/$1',
    }
  }
};