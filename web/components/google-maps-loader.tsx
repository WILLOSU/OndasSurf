"use client";

import { useEffect, useState } from "react";

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
  apiKey: string;
}

export function GoogleMapsLoader({ children, apiKey }: GoogleMapsLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se já está carregado
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }

    // Criar script tag
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => setLoaded(true);
    script.onerror = () =>
      setError("Erro ao carregar Google Maps. Verifique sua API key.");

    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, [apiKey]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <p className="font-semibold text-destructive">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure sua GOOGLE_MAPS_API_KEY no arquivo .env.local
          </p>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-lg text-muted-foreground">
            Carregando Google Maps...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
