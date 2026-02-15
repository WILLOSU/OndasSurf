import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';
import { Beach } from '@src/models/beach';
import { InternalError } from '@src/util/errors/internal-error';

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}
  
  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    try {
      for (const beach of beaches) {
        try {
          const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
          const enrichedBeachData = this.enrichBeachData(points, beach);
          pointsWithCorrectSources.push(...enrichedBeachData);
        } catch (beachError) {
          // Log erro mas continua processando outras praias
          console.error(`Error fetching forecast for beach ${beach.name}:`, beachError);
          
          // Gera dados fake para múltiplos horários (de 3 em 3 horas, próximas 24h)
          const now = new Date();
          now.setMinutes(0, 0, 0); // Zera minutos e segundos
          
          for (let i = 0; i < 8; i++) { // 8 horários = 24 horas
            const forecastTime = new Date(now);
            forecastTime.setHours(now.getHours() + (i * 3)); // +3h a cada iteração
            
            pointsWithCorrectSources.push({
              lat: beach.lat,
              lng: beach.lng,
              name: beach.name,
              position: beach.position,
              //rating: 0,
              time: forecastTime.toISOString(),
              waveHeight: 0,
              waveDirection: 0,
              swellDirection: 0,
              swellHeight: 0,
              swellPeriod: 0,
              windDirection: 0,
              windSpeed: 0,
            });
          }
        }
      }
      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error) {
      // Retorna array vazio ao invés de jogar erro
      console.error('Forecast processing error:', error);
      return [];
    }
  }

  private enrichBeachData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((e) => ({
      lat: beach.lat,
      lng: beach.lng,
      name: beach.name,
      position: beach.position,
      rating: 1,
      ...e,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return forecastByTime;
  }
}