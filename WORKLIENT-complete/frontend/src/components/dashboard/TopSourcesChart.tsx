import { sourceLabel } from "../../lib/utils";
import type { TopSourceItem } from "../../types";

export function TopSourcesChart({ items }: { items: TopSourceItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">No source data yet.</p>;
  }

  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const pct = Math.round((item.count / max) * 100);
        return (
          <div key={item.source} className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-xs text-[var(--color-text-secondary)]">
              {sourceLabel(item.source)}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--color-elevated)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
                role="img"
                aria-label={`${sourceLabel(item.source)}: ${item.count} opportunities`}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-xs font-semibold text-[var(--color-text-primary)]">
              {item.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
