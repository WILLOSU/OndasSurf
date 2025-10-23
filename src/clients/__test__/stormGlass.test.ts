import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3hoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormGlass_normalized_response_3_hours.json';

jest.mock('axios');

/*quero que este TESTE se o STROYGLASS CLIENT está retornando
    o FORECAST normalizado que VEM  do STROYGLASS SERVICE.

    espero que o CLIENT seja responsável por fazer o fecth dos 
    dados e normalizar os dados e me da.

    Normalizar os dados = transformar os dados da maneira que vem
    os dados para maneira que espero na minha aplicação.


*/

describe('StormGlass client', () => {
  it('shoud return the normalized forecast fromt the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    axios.get = jest
      .fn()
      .mockResolvedValue({ data: stormGlassWeather3hoursFixture });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    //expect(response).toEqual({ stormGlassNormalized3HoursFixture });
    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });
});
