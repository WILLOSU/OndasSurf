"use client";

import { Waves } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StarRating } from "@/components/star-rating";
import { WindArrow } from "@/components/wind-arrow";

interface Forecast {
  name: string;
  position: string;
  lat: number;
  lng: number;
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

interface ForecastTableProps {
  forecasts: Forecast[];
  time: string;
}

// Função para formatar timestamp
function formatTime(time: string): string {
  try {
    const date = new Date(time);
    
    if (isNaN(date.getTime())) {
      return "00:00";
    }

    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "00:00";
  }
}

export function ForecastTable({ forecasts, time }: ForecastTableProps) {
  if (forecasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 p-12 text-center">
        <Waves className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">Nenhuma previsão disponível</h3>
        <p className="text-sm text-muted-foreground">
          Adicione uma praia para ver as previsões de ondas.
        </p>
      </div>
    );
  }

  const formattedTime = formatTime(time);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Waves className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">
          Previsão para as {formattedTime}
        </h2>
        <span className="text-sm text-muted-foreground">
          {forecasts.length} {forecasts.length === 1 ? "praia" : "praias"}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Praia</TableHead>
              <TableHead className="text-center">Avaliação</TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center">
                  <Waves className="h-4 w-4" />
                  <span className="text-xs">Swell</span>
                </div>
              </TableHead>
              <TableHead className="text-center">Altura da onda</TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center">
                  <WindArrow direction={0} className="h-4 w-4" />
                  <span className="text-xs">Vento</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forecasts.map((forecast, index) => (
              <TableRow key={`${forecast.name}-${index}`}>
                <TableCell>
                  <div>
                    <div className="font-medium">{forecast.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {forecast.position}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <StarRating rating={forecast.rating} />
                    <span className="text-sm text-muted-foreground">
                      {forecast.rating}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="space-y-1 text-sm">
                    <div>{forecast.swellHeight.toFixed(1)}m</div>
                    <div className="text-xs text-muted-foreground">
                      {forecast.swellPeriod}s period
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  {forecast.waveHeight.toFixed(1)}m
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <WindArrow
                      direction={forecast.windDirection}
                      className="h-5 w-5 text-primary"
                    />
                    <span className="text-sm">{forecast.windSpeed} km/h</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
