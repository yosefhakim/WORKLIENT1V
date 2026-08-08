from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.job import JobOut


class SavedJobOut(BaseModel):
    """شكل الفرصة المحفوظة اللي بيرجع للـ Frontend."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    client_id: str
    job_id: int
    created_at: datetime
    job: JobOut  # تفاصيل الفرصة كاملة


class SavedJobListResponse(BaseModel):
    """شكل قائمة الفرص المحفوظة."""

    items: list[SavedJobOut]
    total: int