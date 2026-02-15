"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, Wind } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface ForecastData {
  time: string;
  waveHeight: number;
  windSpeed: number;
  swellHeight: number;
  rating: number;
}

interface WaveChartProps {
  data: ForecastData[];
  beachName?: string;
}

// Formatar hora para o gráfico
function formatTime(time: string): string {
  try {
    const date = new Date(time);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return time;
  }
}

// Tooltip customizado
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
      <p className="mb-2 font-semibold">{formatTime(payload[0].payload.time)}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

export function WaveChart({ data, beachName }: WaveChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Waves className="h-5 w-5" />
            Gráfico de Ondas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Sem dados de previsão disponíveis
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    time: formatTime(d.time),
    fullTime: d.time,
    "Altura da Onda": d.waveHeight,
    "Altura do Swell": d.swellHeight,
    Rating: d.rating,
  }));

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Waves className="h-5 w-5" />
          Evolução das Ondas {beachName && `- ${beachName}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSwell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis
              dataKey="time"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor" }}
              label={{ value: "Altura (m)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="Altura da Onda"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#colorWave)"
            />
            <Area
              type="monotone"
              dataKey="Altura do Swell"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorSwell)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function WindChart({ data, beachName }: WaveChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wind className="h-5 w-5" />
            Gráfico de Vento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Sem dados de previsão disponíveis
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    time: formatTime(d.time),
    fullTime: d.time,
    "Velocidade do Vento": d.windSpeed,
    Rating: d.rating,
  }));

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wind className="h-5 w-5" />
          Velocidade do Vento {beachName && `- ${beachName}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis
              dataKey="time"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor" }}
              label={{
                value: "Velocidade (km/h)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Velocidade do Vento"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
