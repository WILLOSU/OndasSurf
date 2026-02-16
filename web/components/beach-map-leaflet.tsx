"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrigir icones do Leaflet no Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Icone personalizado para praia selecionada
function createSelectedIcon() {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [30, 49],
    iconAnchor: [15, 49],
    popupAnchor: [1, -40],
    shadowSize: [49, 49],
    className: "selected-marker",
  });
}

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

// Componente para ajustar o zoom automaticamente
function FitBounds({ beaches }: { beaches: Beach[] }) {
  const map = useMap();

  useEffect(() => {
    if (beaches.length === 0) return;

    if (beaches.length === 1) {
      map.setView([beaches[0].lat, beaches[0].lng], 13);
    } else {
      const bounds = L.latLngBounds(
        beaches.map((b) => [b.lat, b.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [beaches, map]);

  return null;
}

function BeachMapInner({ beaches, selectedBeach, onBeachSelect }: BeachMapProps) {
  if (beaches.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" />
            Mapa de Praias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <MapPin className="mb-2 h-8 w-8" />
            <p>Nenhuma praia cadastrada</p>
            <p className="text-sm">
              {"Clique em \"Adicionar Praia\" para comecar"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgLat =
    beaches.reduce((sum, b) => sum + b.lat, 0) / beaches.length;
  const avgLng =
    beaches.reduce((sum, b) => sum + b.lng, 0) / beaches.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4" />
          Mapa de Praias
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-100 w-full overflow-hidden rounded-b-lg">
          <MapContainer
            center={[avgLat, avgLng]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds beaches={beaches} />
            {beaches.map((beach) => (
              <Marker
                key={beach.name}
                position={[beach.lat, beach.lng]}
                icon={
                  beach.name === selectedBeach
                    ? createSelectedIcon()
                    : defaultIcon
                }
                eventHandlers={{
                  click: () => onBeachSelect?.(beach.name),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{beach.name}</strong>
                    <br />
                    {beach.position}
                    {beach.rating !== undefined && (
                      <>
                        <br />
                        {"Rating: " + beach.rating + "/5"}
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Lista de praias abaixo do mapa */}
        <div className="space-y-2 p-4">
          <p className="text-xs text-muted-foreground">
            {beaches.length}{" "}
            {beaches.length === 1
              ? "praia cadastrada"
              : "praias cadastradas"}
          </p>
          {beaches.map((beach, i) => (
            <button
              key={beach.name}
              onClick={() => onBeachSelect?.(beach.name)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all hover:bg-accent ${
                selectedBeach === beach.name
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/60"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{beach.name}</p>
                <p className="text-xs text-muted-foreground">
                  {beach.position}
                </p>
                <p className="text-xs text-muted-foreground">
                  {beach.lat.toFixed(4)}, {beach.lng.toFixed(4)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { BeachMapInner as BeachMap };