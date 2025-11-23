// export function getToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("token") || null;
// }

// export function parseJwt(token?: string | null) {
//   if (!token) return null;
//   try {
//     const payload = token.split(".")[1];
//     return JSON.parse(atob(payload));
//   } catch {
//     return null;
//   }
// }
// src/lib/auth.ts
// Utilities for storing token and wiring it into the API instance
// Exports: saveToken, getToken, removeToken, setAuthToken, parseJwt

const TOKEN_KEY = "token";

export function saveToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

