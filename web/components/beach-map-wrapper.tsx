"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const BeachMapLeaflet = dynamic(
  () =>
    import("@/components/beach-map-leaflet").then((mod) => ({
      default: mod.BeachMap,
    })),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" />
            Mapa de Praias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-100 items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p>Carregando mapa...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  }
);

interface Beach {
  name: string;
  lat: number;
  lng: number;
  position: string;
  rating?: number;
}

interface BeachMapWrapperProps {
  beaches: Beach[];
  selectedBeach?: string;
  onBeachSelect?: (beachName: string) => void;
}

export function BeachMap(props: BeachMapWrapperProps) {
  return <BeachMapLeaflet {...props} />;
}