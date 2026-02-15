import { apiClient } from "./api-client";
import { getToken } from "./auth-client";

export interface ForecastEntry {
  name: string;
  lat: number;
  lng: number;
  position: string;
  rating: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
  time: string;
}

export interface ForecastByTime {
  time: string;
  forecast: ForecastEntry[];
}

export interface Beach {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  position: "N" | "S" | "E" | "W";
}

export async function getForecast(): Promise<ForecastByTime[]> {
  const token = getToken();
  return apiClient<ForecastByTime[]>("/forecast", { token });
}

export async function createBeach(beach: Omit<Beach, "id">): Promise<Beach> {
  const token = getToken();
  return apiClient<Beach>("/beaches", {
    method: "POST",
    body: beach as unknown as Record<string, unknown>,
    token,
  });
}
