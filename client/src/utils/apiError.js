import { hasViteApiUrl, isDeployedFrontend } from "./deployContext.js";

/** Maps axios errors to a user-visible string. */
export function getApiErrorMessage(err, fallback = "Something went wrong") {
  const fromServer = err.response?.data?.message;
  if (fromServer) return fromServer;

  const status = err.response?.status;
  if (status === 405) {
    if (isDeployedFrontend()) {
      return "405 Not Allowed: requests are hitting the Vercel app, not your API. Set VITE_API_URL in Vercel (Production) to your Render API URL, e.g. https://your-service.onrender.com — no trailing slash — then Redeploy.";
    }
    return "405 Not Allowed — check the API URL and that the server exposes POST for this route.";
  }

  const isNetwork =
    err.code === "ERR_NETWORK" ||
    err.message === "Network Error" ||
    (!err.response && err.request);

  if (isNetwork) {
    if (isDeployedFrontend()) {
      if (!hasViteApiUrl()) {
        return "Deploy your API (Render, Railway, etc.), then in Vercel → Settings → Environment Variables set VITE_API_URL to your API base URL (no trailing slash) and redeploy. Add this site’s URL to CLIENT_ORIGIN on the API for CORS.";
      }
      return "Cannot reach your API. Verify VITE_API_URL, that the API is online, and CLIENT_ORIGIN on the server includes this site’s origin.";
    }
    return "Cannot reach the API. From the project folder run npm run dev (API + app), or only the API: cd server && npm run dev (port 5000).";
  }

  return err.message || fallback;
}
