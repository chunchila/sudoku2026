"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-light transition-all active:scale-95 cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
