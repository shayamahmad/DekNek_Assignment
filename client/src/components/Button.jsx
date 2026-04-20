export default function Button({
  children,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 focus-visible:ring-indigo-500/50 disabled:opacity-50",
    secondary:
      "border border-slate-600/80 bg-slate-800/50 text-slate-100 hover:bg-slate-800 focus-visible:ring-slate-500/40",
    ghost: "text-slate-300 hover:bg-white/5 hover:text-white focus-visible:ring-white/20",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c10] disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
