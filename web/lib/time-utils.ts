/**
 * Formata um timestamp (ISO string ou número) para hora legível
 * Ex: "2024-02-14T15:00:00Z" → "15:00"
 * Ex: 1707926400000 → "15:00"
 */
export function formatTime(time: string | number): string {
  try {
    const date = new Date(time);
    
    if (isNaN(date.getTime())) {
      return String(time);
    }

    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return String(time);
  }
}

/**
 * Formata data completa
 * Ex: "2024-02-14T15:00:00Z" → "14/02/2024 15:00"
 */
export function formatDateTime(time: string | number): string {
  try {
    const date = new Date(time);
    
    if (isNaN(date.getTime())) {
      return String(time);
    }

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return String(time);
  }
}

/**
 * Formata apenas a data
 * Ex: "2024-02-14T15:00:00Z" → "14/02/2024"
 */
export function formatDate(time: string | number): string {
  try {
    const date = new Date(time);
    
    if (isNaN(date.getTime())) {
      return String(time);
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return String(time);
  }
}

/**
 * Retorna horário relativo (ex: "há 2 horas", "em 30 minutos")
 */
export function formatRelativeTime(time: string | number): string {
  try {
    const date = new Date(time);
    
    if (isNaN(date.getTime())) {
      return String(time);
    }

    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
    const minutes = Math.floor(Math.abs(diff) / (1000 * 60));

    if (diff < 0) {
      // Passado
      if (hours > 24) return `há ${Math.floor(hours / 24)} dias`;
      if (hours > 0) return `há ${hours}h`;
      if (minutes > 0) return `há ${minutes}min`;
      return "agora";
    } else {
      // Futuro
      if (hours > 24) return `em ${Math.floor(hours / 24)} dias`;
      if (hours > 0) return `em ${hours}h`;
      if (minutes > 0) return `em ${minutes}min`;
      return "agora";
    }
  } catch {
    return String(time);
  }
}
