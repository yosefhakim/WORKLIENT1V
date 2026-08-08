import { api } from "./client";
import type { DashboardStats, SourcesListResponse } from "../types";

export function fetchSources(): Promise<SourcesListResponse> {
  return api.get<SourcesListResponse>(`/sources`);
}

export function fetchDashboardStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>(`/dashboard/stats`);
}
