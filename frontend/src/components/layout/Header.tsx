import { Link, NavLink } from "react-router-dom";
import { Command, LayoutDashboard, Search } from "lucide-react";
import { useSavedJobsQuery } from "../../hooks/useJobs";
import { cn } from "../../lib/utils";

interface HeaderProps {
  onOpenPalette: () => void;
}

export function Header({ onOpenPalette }: HeaderProps) {
  const { data } = useSavedJobsQuery();
  const savedCount = data?.total ?? 0;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-[var(--color-elevated)] text-[var(--color-text-primary)]"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)]">
      <div className="glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="WORKLIENT home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] font-[var(--font-display)] text-sm font-bold text-white">
              W
            </span>
            <span className="font-[var(--font-display)] text-lg font-semibold tracking-tight">
              WORKLIENT
            </span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Primary">
            <NavLink to="/search" className={navLinkClass}>
              <Search size={15} /> <span className="hidden sm:inline">Search</span>
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard size={15} /> <span className="hidden sm:inline">Dashboard</span>
              {savedCount > 0 && (
                <span className="ml-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-semibold text-white">
                  {savedCount}
                </span>
              )}
            </NavLink>
          </nav>

          <button
            onClick={onOpenPalette}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-white/20 hover:text-[var(--color-text-secondary)]"
            aria-label="Open command palette"
          >
            <Search size={13} />
            <span className="hidden md:inline">Quick search</span>
            <span className="ml-1 hidden items-center gap-0.5 rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] md:flex">
              <Command size={10} />K
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
