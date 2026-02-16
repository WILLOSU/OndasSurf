"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Map as MapIcon, Satellite } from "lucide-react";
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Beach {
  name: string;
  lat: number;
  lng: number;
  position: string;
  rating?: number;
}

interface BeachMapProps {
  beaches: Beach[];
  selectedBeach?: string;
  onBeachSelect?: (beachName: string) => void;
}

export function BeachMap({ beaches, selectedBeach, onBeachSelect }: BeachMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || beaches.length === 0) return;

    // Calcular centro baseado nas praias
    const avgLat = beaches.reduce((sum, b) => sum + b.lat, 0) / beaches.length;
    const avgLng = beaches.reduce((sum, b) => sum + b.lng, 0) / beaches.length;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: avgLat, lng: avgLng },
      zoom: beaches.length === 1 ? 13 : 10,
      mapTypeId: mapType,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    setMap(mapInstance);

    return () => {
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [beaches.length]);

  // Atualizar tipo de mapa
  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapType);
    }
  }, [mapType, map]);

  // Adicionar marcadores
  useEffect(() => {
    if (!map || beaches.length === 0) return;

    // Limpar marcadores antigos
    markers.forEach((marker) => marker.setMap(null));

    // Criar novos marcadores
    const newMarkers = beaches.map((beach, index) => {
      const marker = new google.maps.Marker({
        position: { lat: beach.lat, lng: beach.lng },
        map,
        title: beach.name,
        label: {
          text: String(index + 1),
          color: "white",
          fontSize: "12px",
          fontWeight: "bold",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: beach.name === selectedBeach ? "#0ea5e9" : "#3b82f6",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        },
      });

      // Info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 150px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">
              ${beach.name}
            </h3>
            <p style="margin: 0; font-size: 12px; color: #666;">
              ${beach.position}
            </p>
            ${beach.rating ? `
              <p style="margin: 4px 0 0 0; font-size: 12px;">
                ⭐ ${beach.rating}/5
              </p>
            ` : ''}
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        onBeachSelect?.(beach.name);
      });

      // Abrir automaticamente se for a praia selecionada
      if (beach.name === selectedBeach) {
        infoWindow.open(map, marker);
      }

      return marker;
    });

    setMarkers(newMarkers);

    // Ajustar zoom para mostrar todas as praias
    if (beaches.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      beaches.forEach((beach) => {
        bounds.extend({ lat: beach.lat, lng: beach.lng });
      });
      map.fitBounds(bounds);
    }
  }, [map, beaches, selectedBeach]);

  if (beaches.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Mapa de Praias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border/60 text-muted-foreground">
            <div className="text-center">
              <MapIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>Nenhuma praia cadastrada</p>
              <p className="text-sm">Clique em "Adicionar Praia" para começar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Mapa de Praias
          </CardTitle>
          <div className="flex gap-1 rounded-lg border border-border/60 p-1">
            <Button
              variant={mapType === "roadmap" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMapType("roadmap")}
              className="h-7 gap-1 px-2"
            >
              <MapIcon className="h-3.5 w-3.5" />
              Mapa
            </Button>
            <Button
              variant={mapType === "satellite" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMapType("satellite")}
              className="h-7 gap-1 px-2"
            >
              <Satellite className="h-3.5 w-3.5" />
              Satélite
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="h-100 w-full rounded-lg overflow-hidden border border-border/60"
        />
        
        {/* Lista de praias abaixo do mapa */}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            {beaches.length} {beaches.length === 1 ? "praia cadastrada" : "praias cadastradas"}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {beaches.map((beach, i) => (
              <button
                key={beach.name}
                onClick={() => onBeachSelect?.(beach.name)}
                className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:bg-accent ${
                  selectedBeach === beach.name
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60"
                }`}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{beach.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {beach.position}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {beach.lat.toFixed(4)}°, {beach.lng.toFixed(4)}°
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
