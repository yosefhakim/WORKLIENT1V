import { Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

export function MatchBadge({ score }: { score: number | null }) {
  if (score == null) return null;

  const tone =
    score >= 70
      ? "text-[var(--color-success)] border-[var(--color-success)]/25 bg-[var(--color-success)]/10"
      : score >= 40
      ? "text-[var(--color-warning)] border-[var(--color-warning)]/25 bg-[var(--color-warning)]/10"
      : "text-[var(--color-text-secondary)] border-[var(--color-border)] bg-[var(--color-elevated)]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
        tone
      )}
      title="How well this opportunity matches your search"
    >
      <Sparkles size={12} />
      {score}% match
    </span>
  );
}
