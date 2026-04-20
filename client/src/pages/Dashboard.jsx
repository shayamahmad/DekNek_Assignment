import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";
import UserAvatar from "../components/UserAvatar.jsx";
import Button from "../components/Button.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo to="/dashboard" />
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden min-w-0 sm:flex sm:flex-col sm:items-end">
              <span className="truncate text-sm font-medium text-white">{user?.name}</span>
              <span className="truncate text-xs text-slate-500">{user?.email}</span>
            </div>
            <UserAvatar name={user?.name} email={user?.email} size="md" />
            <Button type="button" variant="secondary" className="hidden px-4 py-2 sm:inline-flex" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
        <div className="border-t border-white/[0.04] px-4 py-3 sm:hidden">
          <Button type="button" variant="secondary" className="w-full py-2.5" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="animate-fade-in opacity-0 [animation-fill-mode:forwards]">
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-400/90">Overview</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome back
            {user?.name ? (
              <span className="text-slate-400">, {user.name.split(" ")[0]}</span>
            ) : null}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-400">
            You&apos;re signed in with a valid JWT. Your profile and session details are shown below.
          </p>
          <p className="mt-6 inline-flex rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-200">
            Assignment Done by Shayam Ahmad for DekNek
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <section className="card-glass relative overflow-hidden p-6 sm:p-8 lg:col-span-2">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl"
              aria-hidden
            />
            <h2 className="font-display text-lg font-semibold text-white">Account</h2>
            <p className="mt-1 text-sm text-slate-500">Information from your user record</p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-slate-950/40 p-5">
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Display name</dt>
                <dd className="mt-2 text-lg font-medium text-slate-100">{user?.name ?? "—"}</dd>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-slate-950/40 p-5">
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</dt>
                <dd className="mt-2 break-all text-lg font-medium text-slate-100">{user?.email ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <aside className="card-glass flex flex-col p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-white">Session</h2>
            <p className="mt-1 text-sm text-slate-500">How you stay authenticated</p>
            <ul className="mt-6 flex-1 space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </span>
                <span>
                  <span className="font-medium text-white">JWT</span> stored in{" "}
                  <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-xs text-cyan-300">localStorage</code>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-1.757-1.985L13 11.5V8m0 0L7.757 3.985A2 2 0 008 2h8a2 2 0 011.757 3.985L13 11.5m0 0v3.5"
                    />
                  </svg>
                </span>
                <span>Password never sent again after login — only the token is used for API calls.</span>
              </li>
            </ul>
            <div className="mt-8 rounded-xl border border-dashed border-slate-700/80 bg-slate-950/30 p-4 text-center">
              <p className="text-xs text-slate-500">Protected route</p>
              <p className="mt-1 text-sm text-slate-400">Unauthorized visitors are redirected to sign in.</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-slate-600">
        Vault · JWT authentication demo
      </footer>
    </div>
  );
}
