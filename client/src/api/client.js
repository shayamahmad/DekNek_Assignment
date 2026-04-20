import axios from "axios";

function normalizeApiBase(url) {
  const t = typeof url === "string" ? url.trim() : "";
  if (!t) return "";
  return t.replace(/\/+$/, "");
}

// Dev: empty baseURL + Vite proxy → /api on localhost:5000. Production: VITE_API_URL = Render (etc.) base URL, no /api suffix.
const baseURL =
  normalizeApiBase(import.meta.env.VITE_API_URL) || (import.meta.env.DEV ? "" : "");

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
