import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;

  const items: (number | "ellipsis")[] = [];
  const windowSize = 1;

  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || (p >= page - windowSize && p <= page + windowSize)) {
      items.push(p);
    } else if (items[items.length - 1] !== "ellipsis") {
      items.push("ellipsis");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:enabled:border-white/20 hover:enabled:text-[var(--color-text-primary)] disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {items.map((item, idx) =>
        item === "ellipsis" ? (
          <span key={`e-${idx}`} className="px-1.5 text-[var(--color-text-muted)]">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              item === page
                ? "bg-[var(--color-accent)] text-white"
                : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-white/20 hover:text-[var(--color-text-primary)]"
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:enabled:border-white/20 hover:enabled:text-[var(--color-text-primary)] disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
