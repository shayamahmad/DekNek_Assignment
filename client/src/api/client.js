import axios from "axios";

function normalizeApiBase(url) {
  const t = typeof url === "string" ? url.trim() : "";
  if (!t) return "";
  return t.replace(/\/+$/, "");
}

/**
 * Dev: Vite proxies /api → localhost:5000.
 * Production build on localhost (vite preview): use VITE_API_URL if set.
 * Production on a real host (e.g. *.vercel.app): use same-origin /api so vercel.json can rewrite to Render — avoids CORS and bad VITE_API_URL values.
 */
function resolveApiBaseURL() {
  const envUrl = normalizeApiBase(import.meta.env.VITE_API_URL);

  if (import.meta.env.DEV) {
    return "";
  }

  if (typeof window === "undefined") {
    return envUrl || "";
  }

  const h = window.location.hostname;
  if (h === "localhost" || h === "127.0.0.1") {
    return envUrl || "";
  }

  return "";
}

const baseURL = resolveApiBaseURL();

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
