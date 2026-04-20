import axios from "axios";

// Dev: empty baseURL + Vite proxy → /api on localhost:5000. Production: set VITE_API_URL to your deployed API (no trailing slash).
const baseURL =
  import.meta.env.VITE_API_URL?.trim() || (import.meta.env.DEV ? "" : "");

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
