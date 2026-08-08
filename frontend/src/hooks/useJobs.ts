import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchJobs, fetchJob } from "../api/jobs";
import { fetchSavedJobs, saveJob, unsaveJob } from "../api/saved";
import { fetchSources, fetchDashboardStats } from "../api/sources";
import type { JobSearchParams } from "../types";
import { useToast } from "./useToast";

export function useJobsQuery(params: JobSearchParams) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => fetchJobs(params),
    placeholderData: (prev) => prev,
  });
}

export function useJobQuery(id: number | string | undefined, q?: string) {
  return useQuery({
    queryKey: ["job", id, q],
    queryFn: () => fetchJob(id as number | string, q),
    enabled: id !== undefined,
  });
}

export function useSourcesQuery() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: fetchSources,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });
}

export function useSavedJobsQuery() {
  return useQuery({
    queryKey: ["saved-jobs"],
    queryFn: fetchSavedJobs,
  });
}

interface SaveMutationVars {
  jobId: number;
  isSaved: boolean;
}

interface SaveMutationContext {
  previous: unknown;
}

export function useSaveJobMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<unknown, Error, SaveMutationVars, SaveMutationContext>({
    mutationFn: ({ jobId, isSaved }: SaveMutationVars) =>
      isSaved ? unsaveJob(jobId) : saveJob(jobId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["saved-jobs"] });
      const previous = queryClient.getQueryData(["saved-jobs"]);
      // Optimistic UI is handled locally in components via isSaved param;
      // saved-jobs list refetches on settle.
      return { previous };
    },
    onError: (_err, _vars, context) => {
      showToast("Something went wrong. Please try again.", "error");
      if (context?.previous) {
        queryClient.setQueryData(["saved-jobs"], context.previous);
      }
    },
    onSuccess: (_data, { isSaved }) => {
      showToast(isSaved ? "Removed from saved" : "Saved opportunity", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
