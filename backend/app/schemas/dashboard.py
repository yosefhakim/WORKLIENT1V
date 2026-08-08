from pydantic import BaseModel


class TopSourceItem(BaseModel):
    source: str
    count: int


class DashboardStatsOut(BaseModel):
    saved_jobs: int
    total_jobs: int
    new_jobs_today: int
    with_salary: int
    remote_jobs: int
    avg_max_salary: int | None
    top_sources: list[TopSourceItem]