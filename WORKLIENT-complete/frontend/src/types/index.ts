export interface Job {
  id: number;
  external_id: string | null;
  source: string;
  source_url: string;
  title: string;
  company: string | null;
  description: string | null;
  location: string | null;
  remote: boolean;
  job_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  skills: string[];
  posted_at: string | null;
  created_at: string;
  match_score: number | null;
  match_reason: string | null;
}

export interface JobListResponse {
  items: Job[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface SavedJob {
  id: number;
  client_id: string;
  job_id: number;
  created_at: string;
  job: Job;
}

export interface SavedJobListResponse {
  items: SavedJob[];
  total: number;
}

export interface Source {
  slug: string;
  name: string;
  active: boolean;
  kind: string;
}

export interface SourcesListResponse {
  items: Source[];
  total: number;
}

export interface TopSourceItem {
  source: string;
  count: number;
}

export interface DashboardStats {
  saved_jobs: number;
  total_jobs: number;
  new_jobs_today: number;
  with_salary: number;
  remote_jobs: number;
  avg_max_salary: number | null;
  top_sources: TopSourceItem[];
}

export type SortOption = "newest" | "highest_budget" | "best_match";

export interface JobSearchParams {
  page?: number;
  page_size?: number;
  q?: string;
  source?: string;
  job_type?: string;
  remote?: boolean;
  location?: string;
  salary_min?: number;
  posted_within_days?: number;
  sort?: SortOption;
}
