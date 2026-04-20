import axios from "axios";

// In dev, use same origin + Vite proxy → API (no CORS issues). Set VITE_API_URL when the API is on another host.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "" : "http://localhost:5000");

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
