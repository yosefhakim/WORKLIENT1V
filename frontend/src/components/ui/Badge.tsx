import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const styles: Record<string, string> = {
    default: "bg-[var(--color-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
    accent: "bg-[var(--color-accent)]/12 text-[var(--color-accent-hover)] border-[var(--color-accent)]/25",
    success: "bg-[var(--color-success)]/12 text-[var(--color-success)] border-[var(--color-success)]/25",
    outline: "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
