import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-[var(--color-text-muted)] sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-accent)] font-[var(--font-display)] text-xs font-bold text-white">
            W
          </span>
          <span>WORKLIENT — Every opportunity. One place.</span>
        </div>
        <nav className="flex items-center gap-5" aria-label="Footer">
          <Link to="/search" className="hover:text-[var(--color-text-secondary)]">
            Search
          </Link>
          <Link to="/dashboard" className="hover:text-[var(--color-text-secondary)]">
            Dashboard
          </Link>
          <span className="cursor-default opacity-60" title="Coming soon">
            About
          </span>
        </nav>
      </div>
    </footer>
  );
}
