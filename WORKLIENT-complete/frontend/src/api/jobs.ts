import { api } from "./client";
import type { Job, JobListResponse, JobSearchParams } from "../types";

function buildQuery(params: JobSearchParams): string {
  const usp = new URLSearchParams();
  if (params.page) usp.set("page", String(params.page));
  if (params.page_size) usp.set("page_size", String(params.page_size));
  if (params.q) usp.set("q", params.q);
  if (params.source) usp.set("source", params.source);
  if (params.job_type) usp.set("job_type", params.job_type);
  if (params.remote !== undefined) usp.set("remote", String(params.remote));
  if (params.location) usp.set("location", params.location);
  if (params.salary_min !== undefined) usp.set("salary_min", String(params.salary_min));
  if (params.posted_within_days !== undefined)
    usp.set("posted_within_days", String(params.posted_within_days));
  if (params.sort) usp.set("sort", params.sort);
  return usp.toString();
}

export function fetchJobs(params: JobSearchParams): Promise<JobListResponse> {
  const qs = buildQuery(params);
  return api.get<JobListResponse>(`/jobs${qs ? `?${qs}` : ""}`);
}

export function fetchJob(id: number | string, q?: string): Promise<Job> {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return api.get<Job>(`/jobs/${id}${qs}`);
}
