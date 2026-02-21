"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { getForecast, type ForecastByTime } from "@/lib/forecast-client";
import { ForecastTable } from "@/components/forecast-table";
import { ForecastTimeSelector } from "@/components/forecast-time-selector";
import { BeachForm } from "@/components/beach-form";
import { BeachMap } from "@/components/beach-map-wrapper";
import { WaveChart, WindChart } from "@/components/wave-charts";
import { DataStatusBadge } from "@/components/data-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Waves,
  MapPin,
  TrendingUp,
  Wind,
  Search,
  SlidersHorizontal,
  Star,
  RefreshCw,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-lg font-semibold text-foreground">{value}</span>
          {trend && (
            <span className="text-xs text-green-600 dark:text-green-400">
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-125 rounded-xl" />
        <Skeleton className="h-125 rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    data: forecastData,
    isLoading,
    mutate,
  } = useSWR<ForecastByTime[]>("forecast", getForecast, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 60000,
  });

  const times = forecastData?.map((f) => f.time) ?? [];
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedBeach, setSelectedBeach] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  const activeTime = selectedTime || times[0] || "";
  const activeForecast =
    forecastData?.find((f) => f.time === activeTime)?.forecast ?? [];

  const beaches = useMemo(() => {
    if (!forecastData) return [];

    const allForecasts = forecastData.flatMap((f) => f.forecast);
    const activeRatings = new Map(activeForecast.map((f) => [f.name, f.rating]));

    return Array.from(
      new Map(
        allForecasts.map((f) => [
          f.name,
          {
            name: f.name,
            lat: f.lat,
            lng: f.lng,
            position: f.position,
            rating: activeRatings.get(f.name) ?? f.rating,
          },
        ])
      ).values()
    );
  }, [forecastData, activeForecast]);

  const filteredForecasts = useMemo(() => {
    let filtered = [...activeForecast];

    if (searchQuery) {
      filtered = filtered.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter((f) => f.rating >= minRating);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "wave":
          return b.waveHeight - a.waveHeight;
        case "wind":
          return a.windSpeed - b.windSpeed;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [activeForecast, searchQuery, ratingFilter, sortBy]);

  const filteredBeaches = useMemo(() => {
    return beaches.filter((beach) => {
      const matchesSearch = searchQuery
        ? beach.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesRating =
        ratingFilter !== "all"
          ? beach.rating >= parseInt(ratingFilter)
          : true;

      return matchesSearch && matchesRating;
    });
  }, [beaches, searchQuery, ratingFilter]);

  const totalBeaches = beaches.length;
  const bestRating = activeForecast.length
    ? Math.max(...activeForecast.map((f) => f.rating))
    : 0;
  const avgWave = activeForecast.length
    ? (
        activeForecast.reduce((s, f) => s + f.waveHeight, 0) /
        activeForecast.length
      ).toFixed(1)
    : "0.0";
  const avgWind = activeForecast.length
    ? Math.round(
        activeForecast.reduce((s, f) => s + (f.windSpeed || 0), 0) /
          activeForecast.length
      )
    : 0;

  const chartData = useMemo(() => {
    if (!forecastData || !selectedBeach) return [];

    return forecastData.map((timeData) => {
      const forecast = timeData.forecast.find((f) => f.name === selectedBeach);
      return {
        time: timeData.time,
        waveHeight: forecast?.waveHeight || 0,
        windSpeed: forecast?.windSpeed || 0,
        swellHeight: forecast?.swellHeight || 0,
        rating: forecast?.rating || 0,
      };
    });
  }, [forecastData, selectedBeach]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={MapPin} label="Praias" value={String(totalBeaches)} />
        <StatCard
          icon={TrendingUp}
          label="Melhor Avaliação"
          value={`${bestRating} / 5`}
        />
        <StatCard icon={Waves} label="Onda Média" value={`${avgWave}m`} />
        <StatCard icon={Wind} label="Vento Médio" value={`${avgWind} km/h`} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ForecastTimeSelector
            times={times}
            selected={activeTime}
            onSelect={setSelectedTime}
          />
          <DataStatusBadge forecasts={activeForecast} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
        <BeachForm onBeachCreated={() => mutate()} />
      </div>

      <Card className="border-border/60">
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar praia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-45">
              <Star className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Rating mínimo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas avaliações</SelectItem>
              <SelectItem value="4">⭐ 4+ estrelas</SelectItem>
              <SelectItem value="3">⭐ 3+ estrelas</SelectItem>
              <SelectItem value="2">⭐ 2+ estrelas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Melhor avaliação</SelectItem>
              <SelectItem value="wave">Maior onda</SelectItem>
              <SelectItem value="wind">Menor vento</SelectItem>
              <SelectItem value="name">Nome (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || ratingFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setRatingFilter("all");
              }}
            >
              Limpar filtros
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <BeachMap
          beaches={filteredBeaches}
          selectedBeach={selectedBeach}
          onBeachSelect={(name) => {
            setSelectedBeach(name);
            router.push(`/dashboard/beach/${encodeURIComponent(name)}`);
          }}
        />

        {selectedBeach && chartData.length > 0 ? (
          <div className="space-y-6">
            <WaveChart data={chartData} beachName={selectedBeach} />
            <WindChart data={chartData} beachName={selectedBeach} />
          </div>
        ) : (
          <Card className="border-border/60">
            <CardContent className="p-6">
              <ForecastTable forecasts={filteredForecasts} time={activeTime} />
              {filteredForecasts.length === 0 && activeForecast.length > 0 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Nenhuma praia encontrada com os filtros aplicados
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}