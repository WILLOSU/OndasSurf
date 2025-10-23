import { SetupServer } from '@src/server';
import supertest from 'supertest';
import { Test, SuperTest } from 'supertest';

/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */

declare global {
  var testRequest: SuperTest<Test>;
}

/* eslint-enable no-var */
/* eslint-enable @typescript-eslint/no-unused-vars */

beforeAll(() => {
  const server = new SetupServer();
  server.init();

  global.testRequest = supertest(server.getApp()) as unknown as SuperTest<Test>;
});

export {};
