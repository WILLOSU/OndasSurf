import { AxiosStatic } from 'axios'; // P.0

export interface StormGlassPointSource {
  // P.3
  [key: string]: number; // uma chave string valor número, é dinámico
}

export interface StormGlassPoint {
  // P.4
  readonly time: string;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly waveHeight: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}
export interface StormGlassForecastResponse {
  // P.2
  // resposta da api externa
  // diferença usar interface, usar tipos
  // interface = descrever objetos, shape de dados

  hours: StormGlassPoint[]; // ==> desta forma uma lista com vários |  [StormGlassPoint] <== desta forma é um elemento só.
}

// dados normalizados finais
export interface ForecastPoint {
  // P.5
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
  constructor(protected request: AxiosStatic) {}

  //P.1 - DESATUALIZADO

  /* P.1 - DESATUALIZADO
  public async fetchPoints(lat: number, lng: number): Promisse<{}> {
    return this.request.get();
    `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}source=${this.stormGlassAPISource}&end=15921138026&lat=${lat}&lng=${lng}`
  }
  */

  //P.1 - ATUALIZADO

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const response = await this.request.get<StormGlassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}source=${this.stormGlassAPISource}&end=15921138026&lat=${lat}&lng=${lng}`
    );

    // como saber se a resposta que vem do get é neste formato?
    // get aceita um paramêtro genérico que vem do typeScript
    // você diz para ele qual é o tipo da sua resposta e ele vai retronar uma axios resposta que é um tipo
    // de resposta com o teu tipo de resposta dentro!!

    // get<T = any, R = string>(config?: AnosRequestConfig): Promise<R>;

    return this.normalizeResponse(response.data);
  }

  private normalizeResponse(
    // P.4
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
    // P.6
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
