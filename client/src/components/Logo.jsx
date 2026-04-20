import { Link } from "react-router-dom";

export default function Logo({ to = "/", className = "" }) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-glow"
        aria-hidden
      >
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-1.757-1.985L13 11.5V8m0 0L7.757 3.985A2 2 0 008 2h8a2 2 0 011.757 3.985L13 11.5m0 0v3.5"
          />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-white">Vault</span>
    </span>
  );
  if (to) {
    return (
      <Link to={to} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-lg">
        {inner}
      </Link>
    );
  }
  return inner;
}
