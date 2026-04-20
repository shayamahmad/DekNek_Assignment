/**
 * True when the SPA is not served from a local dev machine (e.g. Vercel, custom domain).
 * Prefer this over import.meta.env.PROD alone — some hosts/builds mis-resolve PROD.
 */
export function isDeployedFrontend() {
  if (typeof window === "undefined") {
    return import.meta.env.PROD === true;
  }
  const h = window.location.hostname;
  return h !== "localhost" && h !== "127.0.0.1";
}

export function hasViteApiUrl() {
  return Boolean(String(import.meta.env.VITE_API_URL ?? "").trim());
}
