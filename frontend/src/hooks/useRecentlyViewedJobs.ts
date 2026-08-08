import { useQueries } from "@tanstack/react-query";
import { fetchJob } from "../api/jobs";
import { getRecentlyViewed } from "../lib/recentlyViewed";

export function useRecentlyViewedJobs() {
  const ids = getRecentlyViewed();

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["job", id, undefined],
      queryFn: () => fetchJob(id),
      staleTime: 60_000,
    })),
  });

  const jobs = results
    .map((r) => r.data)
    .filter((j): j is NonNullable<typeof j> => Boolean(j));

  const isLoading = ids.length > 0 && results.some((r) => r.isLoading);

  return { jobs, isLoading, hasIds: ids.length > 0 };
}
