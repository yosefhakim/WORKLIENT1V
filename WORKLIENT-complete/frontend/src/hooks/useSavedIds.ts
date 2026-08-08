import { useMemo } from "react";
import { useSavedJobsQuery } from "./useJobs";

export function useSavedIds(): Set<number> {
  const { data } = useSavedJobsQuery();
  return useMemo(() => new Set((data?.items ?? []).map((s) => s.job_id)), [data]);
}
