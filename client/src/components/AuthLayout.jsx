import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:48px_48px] bg-grid-pattern opacity-[0.35]"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <aside className="relative flex flex-1 flex-col justify-between px-8 pb-10 pt-10 lg:max-w-md lg:py-16 lg:pl-10 lg:pr-6 xl:max-w-lg xl:pl-16">
          <Logo to="/" />
          <div className="mt-12 hidden lg:mt-0 lg:block">
            <p className="font-display text-4xl font-semibold leading-tight tracking-tight text-white xl:text-[2.75rem]">
              Your workspace,
              <span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                secured by design.
              </span>
            </p>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-400">
              Enterprise-grade authentication with encrypted sessions. Sign in to access your
              protected dashboard.
            </p>
            <ul className="mt-10 space-y-4">
              {[
                "JWT sessions with configurable expiry",
                "Bcrypt-hashed credentials on the server",
                "Role-ready API structure",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="hidden text-xs text-slate-600 lg:block">© {new Date().getFullYear()} Vault</p>
        </aside>

        <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-4 sm:px-8 lg:py-16 lg:pr-10 xl:pr-16">
          <div
            className="animate-slide-up w-full max-w-[420px] opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            <div className="card-glass p-8 sm:p-10">
              <div className="mb-8">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{subtitle}</p>
              </div>
              {children}
              {footer && <div className="mt-8 border-t border-white/[0.06] pt-8 text-center">{footer}</div>}
            </div>
            <p className="mt-8 text-center text-xs text-slate-600 lg:hidden">
              © {new Date().getFullYear()} Vault ·{" "}
              <Link to="/login" className="text-slate-500 hover:text-slate-400">
                Security
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
