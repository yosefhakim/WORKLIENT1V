from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class JobOut(BaseModel):
    """شكل الفرصة اللي بيرجع للـ Frontend."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    external_id: str | None
    source: str
    source_url: str
    title: str
    company: str | None
    description: str | None
    location: str | None
    remote: bool
    job_type: str | None
    salary_min: int | None
    salary_max: int | None
    currency: str | None
    skills: list[str]
    posted_at: datetime | None
    created_at: datetime
    
    # حقول المطابقة (اختيارية، بتتحسب runtime)
    match_score: int | None = Field(None, ge=0, le=100)
    match_reason: str | None = None


class JobListResponse(BaseModel):
    """شكل رد القوائم مع الـ pagination."""

    items: list[JobOut]
    total: int
    page: int
    page_size: int
    pages: int