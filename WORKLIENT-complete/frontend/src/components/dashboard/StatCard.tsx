import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--color-text-muted)]">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-elevated)] text-[var(--color-accent-hover)]">
          <Icon size={15} />
        </span>
      </div>
      <p className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--color-text-primary)]">
        {value}
      </p>
    </motion.div>
  );
}
