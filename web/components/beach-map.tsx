"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { type Beach } from "@/lib/forecast-client";

interface BeachMapProps {
  beaches: Beach[];
  selectedBeach?: string;
  onBeachSelect?: (beachName: string) => void;
}

export function BeachMap({ beaches, selectedBeach, onBeachSelect }: BeachMapProps) {
  if (beaches.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Beach Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No beaches added yet. Click "Add Beach" to get started.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular centro do mapa baseado nas praias
  const avgLat = beaches.reduce((sum, b) => sum + b.lat, 0) / beaches.length;
  const avgLng = beaches.reduce((sum, b) => sum + b.lng, 0) / beaches.length;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          Beach Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-80 w-full overflow-hidden rounded-lg border border-border bg-muted">
          {/* Mapa estático do Google Maps */}
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${avgLat},${avgLng}&zoom=10&size=800x400&maptype=roadmap${beaches
              .map(
                (b, i) =>
                  `&markers=color:blue%7Clabel:${i + 1}%7C${b.lat},${b.lng}`
              )
              .join("")}&key=YOUR_GOOGLE_MAPS_API_KEY`}
            alt="Beach map"
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback: mostrar lista de praias
              e.currentTarget.style.display = "none";
            }}
          />

          {/* Fallback: Lista de praias com coordenadas */}
          <div className="absolute inset-0 bg-background/95 p-4">
            <div className="space-y-2">
              {beaches.map((beach, i) => (
                <button
                  key={beach.name}
                  onClick={() => onBeachSelect?.(beach.name)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                    selectedBeach === beach.name
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{beach.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {beach.position} • {beach.lat.toFixed(4)}°,{" "}
                      {beach.lng.toFixed(4)}°
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
