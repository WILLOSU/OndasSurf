import { SetupServer } from '@src/server';
import supertest from 'supertest';
import { Test, SuperTest } from 'supertest';

/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */

jest.setTimeout(30000);

declare global {
  var testRequest: SuperTest<Test>;
}

/* eslint-enable no-var */
/* eslint-enable @typescript-eslint/no-unused-vars */

let server: SetupServer;

beforeAll(async() => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp()) as unknown as SuperTest<Test>;
});

afterAll(async () => {
  await server.close();
});

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

global.localStorage = localStorageMock as Storage;
global.sessionStorage = localStorageMock as Storage;

export {};
