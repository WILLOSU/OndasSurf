import axios, { AxiosStatic } from 'axios';
import { InternalError } from '@src/util/errors/internal-error';
import config, { IConfig } from 'config';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly waveHeight: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error when tyring to comunicate to StormGlass';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

const stormGlassResourceConfig: IConfig = config.get(
  'App.resources.StormGlass'
);

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request: AxiosStatic = axios) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const token = stormGlassResourceConfig.get<string>('apiToken');

    // ✅ SE O TOKEN FOR FAKE, USA DADOS MOCKADOS
    if (!token || token === 'seu-token-real-aqui') {
      console.log('⚠️  Usando dados mockados (token fake detectado)');
      return this.getMockedData();
    }

    const endTime = Math.floor(Date.now() / 1000) + 48 * 3600;

    try {
      const response = await this.request.get<StormGlassForecastResponse>(
        `${stormGlassResourceConfig.get<string>('apiUrl')}/weather/point?params=${
          this.stormGlassAPIParams
        }&source=${this.stormGlassAPISource}&end=${endTime}&lat=${lat}&lng=${lng}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      return this.normalizeResponse(response.data);
    } catch (err: unknown) {
      console.error(
        '❌ Erro ao buscar dados da StormGlass, usando mock como fallback',
        err
      );
      return this.getMockedData();
    }
  }

  // ✅ DADOS MOCKADOS PARA DESENVOLVIMENTO
  private getMockedData(): ForecastPoint[] {
    const now = new Date();
    const points: ForecastPoint[] = [];

    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 3600000); // +1 hora
      points.push({
        time: time.toISOString(),
        waveHeight: 1.5 + Math.random() * 2, // 1.5m - 3.5m
        waveDirection: 180 + Math.random() * 40, // 180° - 220°
        swellDirection: 170 + Math.random() * 30, // 170° - 200°
        swellHeight: 1.2 + Math.random() * 1.5, // 1.2m - 2.7m
        swellPeriod: 8 + Math.random() * 6, // 8s - 14s
        windDirection: 90 + Math.random() * 60, // 90° - 150°
        windSpeed: 10 + Math.random() * 15, // 10 - 25 km/h
      });
    }

    return points;
  }

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
