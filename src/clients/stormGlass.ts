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
    //logger.info(stormGlassResourceConfig);

    const endTime = Math.floor(Date.now() / 1000) + 48 * 3600; // 48 horas

    try {
      const response = await this.request.get<StormGlassForecastResponse>(
        `${stormGlassResourceConfig.get('apiUrl')}/weather/point?params=${
          this.stormGlassAPIParams
        }&source=${this.stormGlassAPISource}&end=${endTime}&lat=${lat}&lng=${lng}`,
        {
          headers: {
            Authorization: stormGlassResourceConfig.get('apiToken'),
          },
        }
      );

      return this.normalizeResponse(response.data);
    } catch (err: unknown) {
      if (this.isAxiosError(err)) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`
        );
      }
      throw new ClientRequestError(this.getErrorMessage(err));
    }
  }

  // Transforma dados sujos da API em dados limpos para a aplicação
  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      // remove dados inválidos, o map pega só o que preciso de cada fonte
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

  /*
  "Recebo um monte de dados bagunçados com várias fontes. Primeiro filtro só os válidos, 
  depois transformo pegando apenas da fonte NOAA, criando objetos limpos e padronizados."
  */

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      // assume que todas as chaves são nulas ou indefinidas, então verifica se todas existem
      (
        point.time && // força o uso de ponto de exclamação para converter em booleano
        point.swellHeight?.[this.stormGlassAPISource] && // se a chave existe, pega este índice da fonte NOAA
        point.swellPeriod?.[this.stormGlassAPISource] &&
        point.waveDirection?.[this.stormGlassAPISource] &&
        point.waveHeight?.[this.stormGlassAPISource] &&
        point.windDirection?.[this.stormGlassAPISource] &&
        point.windSpeed?.[this.stormGlassAPISource]
      )
    );
  }

  // para um ponto ser válido, todos eles devem dar true, se não descarta o ponto

  private isAxiosError(
    error: unknown
  ): error is { response: { status: number; data: unknown } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: unknown }).response === 'object' &&
      (error as { response: unknown }).response !== null &&
      'status' in (error as { response: { status?: unknown } }).response
    );
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
