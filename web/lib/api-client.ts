const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ondassurf.onrender.com";

interface ApiOptions {
  method?: string;
  body?: Record<string, unknown>;
  token?: string | null;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiClient<T = unknown>(
  endpoint: string,
  { method = "GET", body, token, headers: customHeaders }: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token && token !== "null" && token !== "undefined") {
    headers["x-access-token"] = token;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.message || errorData.error || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
