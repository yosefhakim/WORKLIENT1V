import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { JobCard } from "../components/JobCard";
import { JobCardSkeleton } from "../components/ui/Skeleton";
import { NoResultsState, ErrorState } from "../components/ui/StateViews";
import { Pagination } from "../components/ui/Pagination";
import { FilterSidebar, type Filters } from "../components/search/FilterSidebar";
import { useJobsQuery, useSaveJobMutation } from "../hooks/useJobs";
import { useSavedIds } from "../hooks/useSavedIds";
import { useDebounce } from "../hooks/useDebounce";
import type { Job, SortOption } from "../types";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  best_match: "Best Match",
  highest_budget: "Highest Budget",
};

const PAGE_SIZE = 12;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryInput, setQueryInput] = useState(searchParams.get("q") ?? "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const debouncedQuery = useDebounce(queryInput, 350);

  const page = Number(searchParams.get("page") ?? "1");
  const sort = (searchParams.get("sort") as SortOption) ?? "newest";

  const filters: Filters = useMemo(
    () => ({
      source: searchParams.get("source") ?? undefined,
      job_type: searchParams.get("job_type") ?? undefined,
      remote: searchParams.has("remote") ? searchParams.get("remote") === "true" : undefined,
      location: searchParams.get("location") ?? undefined,
      salary_min: searchParams.has("salary_min") ? Number(searchParams.get("salary_min")) : undefined,
      posted_within_days: searchParams.has("posted_within_days")
        ? Number(searchParams.get("posted_within_days"))
        : undefined,
    }),
    [searchParams]
  );

  // Sync debounced text query into URL (resets to page 1)
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (debouncedQuery === current) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedQuery) next.set("q", debouncedQuery);
    else next.delete("q");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function updateParams(mutator: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(searchParams);
    mutator(next);
    setSearchParams(next);
  }

  function handleFiltersChange(next: Filters) {
    updateParams((usp) => {
      const entries: [string, string | number | boolean | undefined][] = [
        ["source", next.source],
        ["job_type", next.job_type],
        ["remote", next.remote],
        ["location", next.location],
        ["salary_min", next.salary_min],
        ["posted_within_days", next.posted_within_days],
      ];
      for (const [key, value] of entries) {
        if (value === undefined || value === "") usp.delete(key);
        else usp.set(key, String(value));
      }
      usp.set("page", "1");
    });
  }

  function handleClearFilters() {
    updateParams((usp) => {
      for (const key of ["source", "job_type", "remote", "location", "salary_min", "posted_within_days"]) {
        usp.delete(key);
      }
      usp.set("page", "1");
    });
  }

  function handleSortChange(next: SortOption) {
    updateParams((usp) => {
      usp.set("sort", next);
      usp.set("page", "1");
    });
  }

  function handlePageChange(next: number) {
    updateParams((usp) => usp.set("page", String(next)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const q = searchParams.get("q") ?? undefined;

  const { data, isLoading, isFetching, isError, refetch } = useJobsQuery({
    page,
    page_size: PAGE_SIZE,
    q,
    sort,
    ...filters,
  });

  const savedIds = useSavedIds();
  const saveMutation = useSaveJobMutation();

  function handleToggleSave(job: Job) {
    saveMutation.mutate({ jobId: job.id, isSaved: savedIds.has(job.id) });
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-6">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold tracking-tight">Search opportunities</h1>
        <div className="relative mt-4 max-w-xl">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search titles, companies, skills…"
            aria-label="Search opportunities"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-10 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]/50"
          />
          {queryInput && (
            <button
              onClick={() => setQueryInput("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        <FilterSidebar
          filters={filters}
          onChange={handleFiltersChange}
          onClear={handleClearFilters}
          mobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {isLoading ? "Searching…" : `${data?.total ?? 0} opportunities found`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] lg:hidden"
              >
                <SlidersHorizontal size={13} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <label className="sr-only" htmlFor="sort-select">
                Sort by
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]/50"
              >
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
                  <option key={value} value={value}>
                    Sort: {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isError && (
            <ErrorState
              title="Couldn't load opportunities"
              description="Something went wrong while reaching the WORKLIENT API."
              action={
                <button
                  onClick={() => refetch()}
                  className="mt-1 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
                >
                  Try again
                </button>
              }
            />
          )}

          {!isError && (
            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
              style={{ opacity: isFetching && !isLoading ? 0.6 : 1, transition: "opacity 0.15s" }}
            >
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
              {!isLoading &&
                data?.items.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.04 }}
                  >
                    <JobCard
                      job={job}
                      isSaved={savedIds.has(job.id)}
                      onToggleSave={handleToggleSave}
                      saving={saveMutation.isPending}
                    />
                  </motion.div>
                ))}
            </div>
          )}

          {!isError && !isLoading && data?.items.length === 0 && (
            <NoResultsState
              title="No opportunities match your filters"
              description="Try a different keyword or loosen up a filter to see more results."
              action={
                <button
                  onClick={handleClearFilters}
                  className="mt-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:border-white/20"
                >
                  Clear filters
                </button>
              }
            />
          )}

          {!isError && data && data.pages > 1 && (
            <div className="mt-8">
              <Pagination page={data.page} pages={data.pages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
