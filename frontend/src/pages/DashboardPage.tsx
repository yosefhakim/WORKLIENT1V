import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bookmark,
  Briefcase,
  Clock3,
  DollarSign,
  History,
  Sparkles,
  Wifi,
} from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { TopSourcesChart } from "../components/dashboard/TopSourcesChart";
import { JobCard } from "../components/JobCard";
import { JobCardSkeleton } from "../components/ui/Skeleton";
import { EmptyState, ErrorState } from "../components/ui/StateViews";
import {
  useDashboardStatsQuery,
  useJobsQuery,
  useSaveJobMutation,
  useSavedJobsQuery,
} from "../hooks/useJobs";
import { useSavedIds } from "../hooks/useSavedIds";
import { useRecentlyViewedJobs } from "../hooks/useRecentlyViewedJobs";
import type { Job } from "../types";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStatsQuery();
  const { data: saved, isLoading: savedLoading } = useSavedJobsQuery();
  const { jobs: recentJobs, isLoading: recentLoading, hasIds: hasRecent } = useRecentlyViewedJobs();
  const { data: recommendedData, isLoading: recommendedLoading } = useJobsQuery({
    page: 1,
    page_size: 8,
    sort: "best_match",
  });

  const savedIds = useSavedIds();
  const saveMutation = useSaveJobMutation();

  function handleToggleSave(job: Job) {
    saveMutation.mutate({ jobId: job.id, isSaved: savedIds.has(job.id) });
  }

  const recommended = (recommendedData?.items ?? []).filter((j) => !savedIds.has(j.id)).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        Your saved opportunities, activity, and personalized picks.
      </p>

      {statsError && (
        <div className="mt-6">
          <ErrorState title="Couldn't load your stats" description="Please try refreshing the page." />
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Saved" value={statsLoading ? "…" : stats?.saved_jobs ?? 0} icon={Bookmark} delay={0} />
        <StatCard label="Total opportunities" value={statsLoading ? "…" : stats?.total_jobs ?? 0} icon={Briefcase} delay={0.05} />
        <StatCard label="New today" value={statsLoading ? "…" : stats?.new_jobs_today ?? 0} icon={Clock3} delay={0.1} />
        <StatCard label="Remote" value={statsLoading ? "…" : stats?.remote_jobs ?? 0} icon={Wifi} delay={0.15} />
        <StatCard
          label="Avg. top salary"
          value={statsLoading ? "…" : stats?.avg_max_salary != null ? `$${stats.avg_max_salary.toLocaleString()}` : "—"}
          icon={DollarSign}
          delay={0.2}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-lg font-semibold">Saved opportunities</h2>
              <Link to="/search" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                Find more
              </Link>
            </div>

            {savedLoading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <JobCardSkeleton />
                <JobCardSkeleton />
              </div>
            )}

            {!savedLoading && (saved?.items.length ?? 0) === 0 && (
              <EmptyState
                title="Nothing saved yet"
                description="Save opportunities you like and they'll show up here."
                action={
                  <Link
                    to="/search"
                    className="mt-1 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
                  >
                    Browse opportunities
                  </Link>
                }
              />
            )}

            {!savedLoading && (saved?.items.length ?? 0) > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {saved!.items.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                  >
                    <JobCard
                      job={s.job}
                      isSaved
                      onToggleSave={handleToggleSave}
                      saving={saveMutation.isPending}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <History size={17} className="text-[var(--color-text-secondary)]" />
              <h2 className="font-[var(--font-display)] text-lg font-semibold">Recently viewed</h2>
            </div>

            {!hasRecent && (
              <p className="text-sm text-[var(--color-text-muted)]">
                Opportunities you open will show up here for quick access.
              </p>
            )}

            {hasRecent && recentLoading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <JobCardSkeleton />
                <JobCardSkeleton />
              </div>
            )}

            {hasRecent && !recentLoading && recentJobs.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recentJobs.slice(0, 4).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedIds.has(job.id)}
                    onToggleSave={handleToggleSave}
                    saving={saveMutation.isPending}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="mb-4 font-[var(--font-display)] text-sm font-semibold">Top sources</h2>
            {statsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-2.5 animate-pulse rounded-full bg-[var(--color-elevated)]" />
                ))}
              </div>
            ) : (
              <TopSourcesChart items={stats?.top_sources ?? []} />
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-[var(--color-accent-hover)]" />
              <h2 className="font-[var(--font-display)] text-sm font-semibold">Recommended for you</h2>
            </div>
            {recommendedLoading && (
              <div className="space-y-3">
                <JobCardSkeleton />
                <JobCardSkeleton />
              </div>
            )}
            {!recommendedLoading && recommended.length === 0 && (
              <p className="text-sm text-[var(--color-text-muted)]">
                Save a few opportunities and check back for personalized picks.
              </p>
            )}
            {!recommendedLoading && recommended.length > 0 && (
              <div className="space-y-3">
                {recommended.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedIds.has(job.id)}
                    onToggleSave={handleToggleSave}
                    saving={saveMutation.isPending}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
