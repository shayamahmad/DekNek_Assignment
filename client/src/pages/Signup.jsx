import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import Button from "../components/Button.jsx";
import { getApiErrorMessage } from "../utils/apiError.js";

export default function Signup() {
  const { register, token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Signup failed"));
    } finally {
      setSubmitting(false);
    }
  }

  const strength =
    password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start in seconds. We’ll hash your password and issue a secure session token."
      footer={
        <p className="text-sm text-slate-400">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 transition hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            className="flex gap-3 rounded-xl border border-red-500/35 bg-red-950/40 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            <span className="mt-0.5 text-red-400" aria-hidden>
              <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>{error}</span>
          </div>
        )}
        <div>
          <label htmlFor="name" className="label-base">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Jane Cooper"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base"
          />
        </div>
        <div>
          <label htmlFor="email" className="label-base">
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base"
          />
        </div>
        <div>
          <label htmlFor="password" className="label-base">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base"
          />
          <div className="mt-2 flex items-center gap-2">
            <div className="flex flex-1 gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    strength > i
                      ? strength === 1
                        ? "bg-amber-500"
                        : strength === 2
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                      : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">
              {password.length === 0
                ? "Strength"
                : strength === 1
                  ? "Weak"
                  : strength === 2
                    ? "Good"
                    : "Strong"}
            </span>
          </div>
        </div>
        <Button type="submit" className="w-full py-3.5" disabled={submitting}>
          {submitting ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
