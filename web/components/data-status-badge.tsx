"use client";

import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataStatusBadgeProps {
  forecasts: any[];
}

export function DataStatusBadge({ forecasts }: DataStatusBadgeProps) {
  // Verifica se tem dados reais ou fake
  const hasRealData = forecasts.some(
    (f) => f.waveHeight > 0 || f.windSpeed > 0 || f.rating > 0
  );

  // Verifica se tem múltiplos horários
  const hasMultipleForecasts = forecasts.length > 1;

  if (!forecasts.length) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Sem Dados
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">
              Nenhuma praia cadastrada. Adicione uma praia para ver as previsões.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (hasRealData) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="default" className="gap-1.5 bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Dados Reais
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">
              Previsões reais da API StormGlass.
              {hasMultipleForecasts && ` ${forecasts.length} horários disponíveis.`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Dados de Teste
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-xs">
            Usando dados simulados. Configure um token válido do StormGlass no
            backend para obter previsões reais.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
