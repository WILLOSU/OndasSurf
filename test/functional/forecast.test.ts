/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../globals.d.ts" />

import { Beach, BeachPosition } from '@src/models/beach';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import nock from 'nock';
import apiForecastResponse1BeachFixture from '@test/fixtures/api.forecast_response_1_beach.json';
import { User } from '@src/models/users';
import AuthService from '@src/services/auth';

describe('Beach forecast functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john2@mail.com',
    password: '1234',
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let token: string;
  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: user._id,
    };
    await new Beach(defaultBeach).save();

    token = AuthService.generateToken(user.toJSON());
  });

  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query(true)
      .reply(200, stormGlassWeather3HoursFixture);

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token });
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1BeachFixture);
  }, 10000);

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query(true)
      .replyWithError('Something went wrong');

    const { status, body } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token });

    expect(status).toBe(500);
    expect(body).toEqual({
      code: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  }, 10000);
});

// o super teste bate em um rota e compare a resposta
// ISSO QUE EU ESPERO NO FINAL DA ROTA, QUERO QUE ELA ME DEVOVA O FORECAST

// mude de toBe para toEquals
