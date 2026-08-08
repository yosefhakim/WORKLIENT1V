from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String, Text

from app.database.session import Base


def utcnow() -> datetime:
    """توقيت UTC نايف، موحد لكل timestamps القاعدة."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Job(Base):
    """فرصة شغل/فريلانس متوحدة الشكل من أي مصدر."""

    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    # هوية الفرصة عند المصدر الأصلي
    external_id = Column(String, nullable=True)
    source = Column(String, nullable=False, index=True)
    source_url = Column(String, nullable=False)

    # المعلومات الأساسية
    title = Column(String, nullable=False)
    company = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    # طبيعة الشغل
    location = Column(String, nullable=True)
    remote = Column(Boolean, default=False, nullable=False)
    job_type = Column(String, nullable=True)

    # الفلوس
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    currency = Column(String, nullable=True)

    # المهارات كقائمة JSON، مثال: ["Python", "FastAPI"]
    skills = Column(JSON, default=list, nullable=False)

    # التواريخ
    posted_at = Column(DateTime, nullable=True)
    scraped_at = Column(DateTime, default=utcnow, nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)