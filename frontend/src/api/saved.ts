import { api } from "./client";
import type { SavedJob, SavedJobListResponse } from "../types";

export function fetchSavedJobs(): Promise<SavedJobListResponse> {
  return api.get<SavedJobListResponse>(`/saved`);
}

export function saveJob(jobId: number): Promise<SavedJob> {
  return api.post<SavedJob>(`/jobs/${jobId}/save`);
}

export function unsaveJob(jobId: number): Promise<void> {
  return api.del<void>(`/jobs/${jobId}/save`);
}
