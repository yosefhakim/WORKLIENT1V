import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Building2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
  Wifi,
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/StateViews";
import { useJobQuery, useSaveJobMutation } from "../hooks/useJobs";
import { useSavedIds } from "../hooks/useSavedIds";
import { addRecentlyViewed } from "../lib/recentlyViewed";
import { cn, formatJobType, formatSalary, sourceLabel, timeAgo } from "../lib/utils";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? undefined;

  const { data: job, isLoading, isError, refetch } = useJobQuery(id, q);
  const savedIds = useSavedIds();
  const saveMutation = useSaveJobMutation();

  useEffect(() => {
    if (job) addRecentlyViewed(job.id);
  }, [job]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-6 h-8 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/3" />
        <Skeleton className="mt-8 h-40 w-full" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <ErrorState
          title="Opportunity not found"
          description="This opportunity may have been removed, or the link is incorrect."
          action={
            <div className="flex gap-2">
              <button
                onClick={() => refetch()}
                className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
              >
                Try again
              </button>
              <Link
                to="/search"
                className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)]"
              >
                Back to search
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const isSaved = savedIds.has(job.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-3xl px-5 py-10"
    >
      <Link
        to="/search"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        <ArrowLeft size={14} /> Back to search
      </Link>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{sourceLabel(job.source)}</Badge>
          {job.remote && (
            <Badge variant="accent">
              <Wifi size={11} /> Remote
            </Badge>
          )}
          <Badge>{formatJobType(job.job_type)}</Badge>
        </div>

        <h1 className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
          {job.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1.5">
            <Building2 size={14} /> {job.company || "Confidential"}
          </span>
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {job.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> Posted {timeAgo(job.posted_at)}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-[var(--font-display)] text-xl font-semibold text-[var(--color-text-primary)]">
            {formatSalary(job.salary_min, job.salary_max, job.currency)}
          </span>
          {job.match_score != null && (
            <Badge variant="accent">
              <Sparkles size={12} /> {job.match_score}% match
            </Badge>
          )}
        </div>

        {job.skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Open original opportunity <ExternalLink size={14} />
          </a>
          <button
            onClick={() => saveMutation.mutate({ jobId: job.id, isSaved })}
            disabled={saveMutation.isPending}
            aria-pressed={isSaved}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors",
              isSaved
                ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/12 text-[var(--color-accent-hover)]"
                : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-white/20"
            )}
          >
            <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save opportunity"}
          </button>
        </div>
      </div>

      {job.match_reason && (
        <div className="mt-6 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.06] p-5">
          <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-hover)]">
            <Sparkles size={14} /> Why this opportunity?
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">{job.match_reason}</p>
        </div>
      )}

      {job.description && (
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <h2 className="mb-3 font-[var(--font-display)] text-base font-semibold text-[var(--color-text-primary)]">
            About this opportunity
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {job.description}
          </p>
        </div>
      )}
    </motion.div>
  );
}
