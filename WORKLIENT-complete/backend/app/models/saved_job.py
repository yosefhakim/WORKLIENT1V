from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.session import Base
from app.models.job import utcnow


class SavedJob(Base):
    """فرصة محفوظة لمستخدم مجهول (client_id)."""

    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    # علاقة عشان نقدر نجيب تفاصيل الفرصة بسهولة
    job = relationship("Job", lazy="joined")