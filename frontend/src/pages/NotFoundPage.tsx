import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-28 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-elevated)] text-[var(--color-accent-hover)]">
        <Compass size={24} />
      </span>
      <h1 className="mt-6 font-[var(--font-display)] text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)]"
      >
        Back to home
      </Link>
    </div>
  );
}
