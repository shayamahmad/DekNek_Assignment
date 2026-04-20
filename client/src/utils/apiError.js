import { isDeployedFrontend } from "./deployContext.js";

/** Maps axios errors to a user-visible string. */
export function getApiErrorMessage(err, fallback = "Something went wrong") {
  const fromServer = err.response?.data?.message;
  if (fromServer) return fromServer;

  const status = err.response?.status;
  if (status === 405) {
    if (isDeployedFrontend()) {
      return "405: POST hit the static app instead of the API. Redeploy so vercel.json proxies /api to Render, or set VITE_API_URL + rebuild.";
    }
    return "405 Not Allowed — check the API URL and that the server exposes POST for this route.";
  }

  const isNetwork =
    err.code === "ERR_NETWORK" ||
    err.message === "Network Error" ||
    (!err.response && err.request);

  if (isNetwork) {
    if (isDeployedFrontend()) {
      return "Cannot reach the API through this site. Wait for Render to wake (free tier), confirm vercel.json proxies /api to your Render URL, and set MONGODB_URI + CLIENT_ORIGIN on Render.";
    }
    return "Cannot reach the API. From the project folder run npm run dev (API + app), or only the API: cd server && npm run dev (port 5000).";
  }

  return err.message || fallback;
}
