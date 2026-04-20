export default function UserAvatar({ name, email, size = "md" }) {
  const initial =
    name?.trim()?.charAt(0)?.toUpperCase() ||
    email?.trim()?.charAt(0)?.toUpperCase() ||
    "?";
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white shadow-md ring-2 ring-white/10 ${sizes[size]}`}
      aria-hidden
    >
      {initial}
    </div>
  );
}
