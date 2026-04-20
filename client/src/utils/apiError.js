/**
 * Maps axios errors to a user-visible string.
 */
export function getApiErrorMessage(err, fallback = "Something went wrong") {
  const fromServer = err.response?.data?.message;
  if (fromServer) return fromServer;

  const isNetwork =
    err.code === "ERR_NETWORK" ||
    err.message === "Network Error" ||
    (!err.response && err.request);

  if (isNetwork) {
    return "Cannot reach the API. In a terminal run: cd server && npm run dev (port 5000). If the server is running, check client uses the same URL as VITE_API_URL or http://localhost:5000.";
  }

  return err.message || fallback;
}
