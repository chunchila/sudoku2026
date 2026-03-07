import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-light transition-all active:scale-95"
      >
        Go home
      </Link>
    </div>
  );
}
