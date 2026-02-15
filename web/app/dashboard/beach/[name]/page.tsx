"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { getForecast, type ForecastByTime } from "@/lib/forecast-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WaveChart, WindChart } from "@/components/wave-charts";
import { StarRating } from "@/components/star-rating";
import { WindArrow } from "@/components/wind-arrow";
import {
  ArrowLeft,
  MapPin,
  Waves,
  Wind,

  Clock,

} from "lucide-react";

export default function BeachDetailPage() {
  const params = useParams();
  const router = useRouter();
  const beachName = decodeURIComponent(params.name as string);

  const { data: forecastData, isLoading } = useSWR<ForecastByTime[]>(
    "forecast",
    getForecast
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Filtrar previsões apenas desta praia
  const beachForecasts =
    forecastData
      ?.map((timeData) => ({
        time: timeData.time,
        forecast: timeData.forecast.find((f) => f.name === beachName),
      }))
      .filter((d) => d.forecast) || [];

  const currentForecast = beachForecasts[0]?.forecast;

  if (!currentForecast) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mb-4 text-lg text-muted-foreground">Praia não encontrada</p>
        <Button onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  // Dados para os gráficos
  const chartData = beachForecasts.map((d) => ({
    time: d.time,
    waveHeight: d.forecast!.waveHeight,
    windSpeed: d.forecast!.windSpeed,
    swellHeight: d.forecast!.swellHeight,
    rating: d.forecast!.rating,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">{currentForecast.name}</h1>
          <p className="text-muted-foreground">{currentForecast.position}</p>
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={currentForecast.rating} />
          <span className="text-2xl font-bold">{currentForecast.rating}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Waves className="h-4 w-4" />
              Altura da Onda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {currentForecast.waveHeight.toFixed(1)}m
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Waves className="h-4 w-4" />
              Swell
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {currentForecast.swellHeight.toFixed(1)}m
            </p>
            <p className="text-sm text-muted-foreground">
              {currentForecast.swellPeriod}s período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Wind className="h-4 w-4" />
              Vento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentForecast.windSpeed} km/h</p>
            <div className="mt-2 flex items-center gap-2">
              <WindArrow direction={currentForecast.windDirection} className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">
                {currentForecast.windDirection}°
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Localização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Lat: {currentForecast.lat.toFixed(4)}°
            </p>
            <p className="text-sm">
              Lng: {currentForecast.lng.toFixed(4)}°
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WaveChart data={chartData} />
        <WindChart data={chartData} />
      </div>

      {/* Detailed Forecast Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Previsão Detalhada (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium">Horário</th>
                  <th className="pb-3 text-center font-medium">Rating</th>
                  <th className="pb-3 text-center font-medium">Onda</th>
                  <th className="pb-3 text-center font-medium">Swell</th>
                  <th className="pb-3 text-center font-medium">Vento</th>
                </tr>
              </thead>
              <tbody>
                {beachForecasts.slice(0, 12).map((item, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3">
                      {new Date(item.time).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <StarRating rating={item.forecast!.rating} />
                        <span className="text-xs text-muted-foreground">
                          {item.forecast!.rating}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center font-medium">
                      {item.forecast!.waveHeight.toFixed(1)}m
                    </td>
                    <td className="py-3 text-center">
                      {item.forecast!.swellHeight.toFixed(1)}m
                      <span className="text-xs text-muted-foreground ml-1">
                        ({item.forecast!.swellPeriod}s)
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <WindArrow
                          direction={item.forecast!.windDirection}
                          className="h-4 w-4"
                        />
                        {item.forecast!.windSpeed} km/h
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
