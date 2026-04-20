export default function Spinner({ className = "h-8 w-8" }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${className} animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-400`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
