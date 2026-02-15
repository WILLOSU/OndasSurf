"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ForecastTimeSelectorProps {
  times: string[];
  selected: string;
  onSelect: (time: string) => void;
}

// Função para formatar timestamp em horário legível
function formatTime(time: string): string {
  try {
    const date = new Date(time);
    
    if (isNaN(date.getTime())) {
      // Se não for uma data válida, retorna vazio
      return "";
    }

    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

export function ForecastTimeSelector({
  times,
  selected,
  onSelect,
}: ForecastTimeSelectorProps) {
  if (times.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Horário:</span>
      </div>
      <ScrollArea className="w-full max-w-xl">
        <div className="flex gap-2">
          {times.map((time) => {
            const formattedTime = formatTime(time);
            
            // Se não conseguir formatar, não mostra o botão
            if (!formattedTime) return null;

            return (
              <Button
                key={time}
                variant={selected === time ? "default" : "outline"}
                size="sm"
                onClick={() => onSelect(time)}
                className="shrink-0"
              >
                {formattedTime}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
