from pydantic import BaseModel


class SourceOut(BaseModel):
    """معلومات عن مصدر الفرص."""

    slug: str
    name: str
    active: bool
    kind: str  # freelance, remote_jobs, jobs, social


class SourcesListResponse(BaseModel):
    items: list[SourceOut]
    total: int