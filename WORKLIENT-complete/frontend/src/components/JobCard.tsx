import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bookmark, MapPin, Wifi, Clock } from "lucide-react";
import { Badge } from "./ui/Badge";
import { MatchBadge } from "./ui/MatchBadge";
import { cn, formatSalary, sourceLabel, timeAgo } from "../lib/utils";
import type { Job } from "../types";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (job: Job) => void;
  saving?: boolean;
}

export function JobCard({ job, isSaved, onToggleSave, saving }: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-shadow hover:border-white/15 hover:shadow-[0_0_0_1px_rgba(124,92,255,0.15),0_16px_40px_-16px_rgba(124,92,255,0.35)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <Badge variant="outline">{sourceLabel(job.source)}</Badge>
            {job.remote && (
              <Badge variant="accent">
                <Wifi size={11} /> Remote
              </Badge>
            )}
          </div>
          <Link to={`/jobs/${job.id}`} className="block">
            <h3 className="truncate font-[var(--font-display)] text-base font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-white">
              {job.title}
            </h3>
          </Link>
          <p className="mt-0.5 truncate text-sm text-[var(--color-text-secondary)]">
            {job.company || "Confidential"}
          </p>
        </div>
        <button
          onClick={() => onToggleSave(job)}
          disabled={saving}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save opportunity"}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
            isSaved
              ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 text-[var(--color-accent-hover)]"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-white/20"
          )}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {job.skills.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
          {job.skills.length > 4 && <Badge>+{job.skills.length - 4}</Badge>}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--color-text-muted)]">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {job.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock size={12} /> {timeAgo(job.posted_at)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3.5">
        <div className="flex items-center gap-2">
          <span className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text-primary)]">
            {formatSalary(job.salary_min, job.salary_max, job.currency)}
          </span>
          <MatchBadge score={job.match_score} />
        </div>
        <Link
          to={`/jobs/${job.id}`}
          className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/10"
        >
          View
        </Link>
      </div>
    </motion.div>
  );
}
