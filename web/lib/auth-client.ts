import { apiClient } from "./api-client";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  name?: string;
  email?: string;
  id?: string;
}

const TOKEN_KEY = "__finding_waves_token__";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiClient<{ user: User; token: string }>("/users/authenticate", {
    method: "POST",
    body: { email, password },
  });
  if (data.token) {
    setToken(data.token);
  }
  return {
    token: data.token,
    user: data.user,
    name: data.user?.name,
    email: data.user?.email,
    id: data.user?.id,
  };
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  await apiClient("/users", {
    method: "POST",
    body: { name, email, password },
  });
  return login(email, password);
}

export async function getUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const data = await apiClient<{ user: User }>("/users/me", { token });
    return data.user ?? null;
  } catch {
    removeToken();
    return null;
  }
}

export function logout(): void {
  removeToken();
  window.location.href = "/login";
}