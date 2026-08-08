import { X } from "lucide-react";
import { useSourcesQuery } from "../../hooks/useJobs";
import { cn, sourceLabel } from "../../lib/utils";
import type { JobSearchParams } from "../../types";

export interface Filters {
  source?: string;
  job_type?: string;
  remote?: boolean;
  location?: string;
  salary_min?: number;
  posted_within_days?: number;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const JOB_TYPES: { value: NonNullable<JobSearchParams["job_type"]>; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "freelance", label: "Freelance" },
  { value: "contract", label: "Contract" },
  { value: "part_time", label: "Part-time" },
  { value: "internship", label: "Internship" },
];

const POSTED_OPTIONS = [
  { value: 1, label: "Past 24 hours" },
  { value: 3, label: "Past 3 days" },
  { value: 7, label: "Past week" },
  { value: 30, label: "Past month" },
];

const SALARY_OPTIONS = [500, 1000, 2000, 3000, 5000];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
      {children}
    </p>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-left text-xs font-medium transition-colors",
        active
          ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/12 text-[var(--color-accent-hover)]"
          : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-white/20 hover:text-[var(--color-text-primary)]"
      )}
    >
      {children}
    </button>
  );
}

export function FilterSidebar({ filters, onChange, onClear, mobileOpen, onCloseMobile }: FilterSidebarProps) {
  const { data: sourcesData } = useSourcesQuery();

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function toggle<K extends keyof Filters>(key: K, value: Filters[K]) {
    set(key, filters[key] === value ? undefined : value);
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== "");

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text-primary)]">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <SectionLabel>Remote</SectionLabel>
        <div className="flex gap-2">
          <Pill active={filters.remote === true} onClick={() => toggle("remote", true)}>
            Remote only
          </Pill>
          <Pill active={filters.remote === false} onClick={() => toggle("remote", false)}>
            On-site
          </Pill>
        </div>
      </div>

      <div>
        <SectionLabel>Job type</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {JOB_TYPES.map((jt) => (
            <Pill key={jt.value} active={filters.job_type === jt.value} onClick={() => toggle("job_type", jt.value)}>
              {jt.label}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Source</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {(sourcesData?.items ?? []).map((s) => (
            <Pill key={s.slug} active={filters.source === s.slug} onClick={() => toggle("source", s.slug)}>
              {sourceLabel(s.slug)}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Location</SectionLabel>
        <input
          value={filters.location ?? ""}
          onChange={(e) => set("location", e.target.value || undefined)}
          placeholder="e.g. Cairo, Remote…"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]/50"
        />
      </div>

      <div>
        <SectionLabel>Minimum salary</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {SALARY_OPTIONS.map((amount) => (
            <Pill key={amount} active={filters.salary_min === amount} onClick={() => toggle("salary_min", amount)}>
              ${amount.toLocaleString()}+
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Posted within</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {POSTED_OPTIONS.map((opt) => (
            <Pill
              key={opt.value}
              active={filters.posted_within_days === opt.value}
              onClick={() => toggle("posted_within_days", opt.value)}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-[var(--color-surface)] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-[var(--font-display)] text-sm font-semibold">Filters</span>
              <button onClick={onCloseMobile} aria-label="Close filters" className="text-[var(--color-text-muted)]">
                <X size={18} />
              </button>
            </div>
            {content}
            <button
              onClick={onCloseMobile}
              className="mt-6 w-full rounded-lg bg-[var(--color-accent)] py-2.5 text-sm font-semibold text-white"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
