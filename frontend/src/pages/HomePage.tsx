import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Hero } from "../components/home/Hero";
import { JobCard } from "../components/JobCard";
import { JobCardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/StateViews";
import { useJobsQuery, useSaveJobMutation } from "../hooks/useJobs";
import { useSavedIds } from "../hooks/useSavedIds";
import type { Job } from "../types";

export default function HomePage() {
  const { data, isLoading, isError, refetch } = useJobsQuery({
    page: 1,
    page_size: 6,
    sort: "newest",
  });
  const savedIds = useSavedIds();
  const saveMutation = useSaveJobMutation();

  function handleToggleSave(job: Job) {
    saveMutation.mutate({ jobId: job.id, isSaved: savedIds.has(job.id) });
  }

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-tight">
              Fresh opportunities
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              The latest opportunities added across all sources.
            </p>
          </div>
          <Link
            to="/search"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] sm:flex"
          >
            View all <ArrowRight size={14} />
          </Link>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
            {!isLoading &&
              data?.items.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
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

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            to="/search"
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)]"
          >
            View all opportunities <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
