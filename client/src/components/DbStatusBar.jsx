import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { hasViteApiUrl, isDeployedFrontend } from "../utils/deployContext.js";

/**
 * Polls GET /api/health and shows whether the API and MongoDB are reachable.
 */
export default function DbStatusBar() {
  const [status, setStatus] = useState({
    loading: true,
    apiReachable: false,
    mongoConnected: false,
    mongoState: null,
    mongoReadyState: null,
    mongoHint: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const { data } = await api.get("/api/health");
        if (cancelled) return;
        setStatus({
          loading: false,
          apiReachable: true,
          mongoConnected: Boolean(data.mongo?.connected),
          mongoState: data.mongo?.state ?? null,
          mongoReadyState: typeof data.mongo?.readyState === "number" ? data.mongo.readyState : null,
          mongoHint: data.mongo?.hint ?? null,
        });
      } catch {
        if (cancelled) return;
        setStatus({
          loading: false,
          apiReachable: false,
          mongoConnected: false,
          mongoState: null,
          mongoReadyState: null,
        });
      }
    }

    poll();
    const id = setInterval(poll, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (status.loading) {
    return (
      <div
        className="sticky top-0 z-[100] border-b border-white/10 bg-slate-950/90 px-4 py-2 text-center text-xs text-slate-400 backdrop-blur-md"
        role="status"
        aria-live="polite"
      >
        Checking API and database…
      </div>
    );
  }

  if (!status.apiReachable) {
    const missingProdApi = isDeployedFrontend() && !hasViteApiUrl();

    if (missingProdApi) {
      return (
        <div
          className="sticky top-0 z-[100] border-b border-amber-500/30 bg-amber-950/45 px-4 py-2 text-center text-xs text-amber-100 backdrop-blur-md"
          role="alert"
        >
          Vercel only hosts the frontend. Deploy the API (e.g. Render, Railway, Fly.io), then in Vercel → Project →
          Settings → Environment Variables add{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[11px]">VITE_API_URL</code> = your API base
          URL (no trailing slash), redeploy, and set{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[11px]">CLIENT_ORIGIN</code> on the server to
          this site&apos;s URL for CORS.
        </div>
      );
    }

    if (!isDeployedFrontend()) {
      return (
        <div
          className="sticky top-0 z-[100] border-b border-red-500/30 bg-red-950/50 px-4 py-2 text-center text-xs text-red-200 backdrop-blur-md"
          role="alert"
        >
          API unreachable — from the{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[11px]">project</code> folder run{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[11px]">npm run dev</code> (starts API + app),
          or only the API:{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[11px]">cd server && npm run dev</code>
        </div>
      );
    }

    return (
      <div
        className="sticky top-0 z-[100] border-b border-red-500/30 bg-red-950/50 px-4 py-2 text-center text-xs text-red-200 backdrop-blur-md"
        role="alert"
      >
        API unreachable — check <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[11px]">VITE_API_URL</code>{" "}
        in Vercel (must match your deployed API), CORS <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[11px]">CLIENT_ORIGIN</code> on the server, and that the API is running.
      </div>
    );
  }

  if (status.mongoConnected) {
    return (
      <div
        className="sticky top-0 z-[100] border-b border-emerald-500/25 bg-emerald-950/40 px-4 py-2 text-center text-xs text-emerald-100 backdrop-blur-md"
        role="status"
        aria-live="polite"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" aria-hidden />
          MongoDB connected — sign up and data will sync to your Atlas cluster.
        </span>
      </div>
    );
  }

  const rs = status.mongoReadyState;
  const isConnecting = status.mongoState === "connecting" || rs === 2;

  if (isConnecting) {
    return (
      <div
        className="sticky top-0 z-[100] border-b border-slate-500/25 bg-slate-950/80 px-4 py-2 text-center text-xs text-slate-300 backdrop-blur-md"
        role="status"
        aria-live="polite"
      >
        Connecting to MongoDB… (this can take a few seconds right after your API wakes up on Render)
      </div>
    );
  }

  const stateLine =
    status.mongoState ||
    (status.mongoReadyState !== null ? `readyState ${status.mongoReadyState}` : null);

  const localMongoFallback =
    "MongoDB is not connected. Set MONGODB_URI (or MONGODB_PASSWORD + cluster host) in server/.env, then restart the API. Confirm Atlas Database User password and Network Access.";

  const hint = status.mongoHint?.trim() ?? "";

  // Production: no generic nag — only show a bar if the API returned a concrete hint (e.g. Atlas auth).
  if (isDeployedFrontend() && !hint) {
    return null;
  }

  return (
    <div
      className="sticky top-0 z-[100] border-b border-amber-500/30 bg-amber-950/40 px-4 py-2 text-center text-xs text-amber-100 backdrop-blur-md"
      role="alert"
    >
      <span className="block">{hint || localMongoFallback}</span>
      {stateLine ? (
        <span className="mt-1 block text-[11px] text-amber-200/80">
          Status: {stateLine}
        </span>
      ) : null}
    </div>
  );
}
