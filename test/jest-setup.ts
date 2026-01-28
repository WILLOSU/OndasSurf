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

export {};
