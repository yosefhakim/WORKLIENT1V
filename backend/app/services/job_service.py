from datetime import datetime, timedelta, timezone

from sqlalchemy import String, case, cast, or_
from sqlalchemy.orm import Session, Query

from app.models import Job


SORT_OPTIONS = {"newest", "highest_budget", "best_match"}


def _apply_search(query: Query, q: str) -> Query:
    """بحث بالكلمة في أهم حقول الفرصة."""
    like = f"%{q}%"
    return query.filter(
        or_(
            Job.title.ilike(like),
            Job.company.ilike(like),
            Job.description.ilike(like),
            cast(Job.skills, String).ilike(like),
        )
    )


def _apply_filters(
    query: Query,
    source: str | None,
    job_type: str | None,
    remote: bool | None,
    location: str | None,
    salary_min: int | None,
    posted_within_days: int | None,
) -> Query:
    if source:
        query = query.filter(Job.source == source)
    if job_type:
        query = query.filter(Job.job_type == job_type)
    if remote is not None:
        query = query.filter(Job.remote == remote)
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if salary_min is not None:
        # نعتبر إن أي فرصة فيها max >= salary_min مؤهلة
        query = query.filter(Job.salary_max >= salary_min)
    if posted_within_days is not None:
        cutoff = datetime.now(timezone.utc) - timedelta(days=posted_within_days)
        query = query.filter(Job.posted_at >= cutoff)
    return query


def _apply_sort(query: Query, sort: str, q: str | None) -> Query:
    if sort == "newest":
        return query.order_by(Job.posted_at.desc(), Job.id.desc())
    if sort == "highest_budget":
        # NULLs في الآخر
        return query.order_by(Job.salary_max.desc().nullslast(), Job.id.desc())
    if sort == "best_match":
        # ترتيب بسيط: الأولوية لمن عندهم match في العنوان، ثم المهارات، ثم الوصف
        if q:
            like = f"%{q}%"
            return query.order_by(
                # 2 لو الكلمة في العنوان، 1 لو لأ
                case((Job.title.ilike(like), 2), else_=1).desc(),
                Job.posted_at.desc(),
                Job.id.desc(),
            )
        return query.order_by(Job.posted_at.desc(), Job.id.desc())
    return query.order_by(Job.posted_at.desc(), Job.id.desc())


def search_jobs(
    db: Session,
    *,
    page: int,
    page_size: int,
    q: str | None = None,
    source: str | None = None,
    job_type: str | None = None,
    remote: bool | None = None,
    location: str | None = None,
    salary_min: int | None = None,
    posted_within_days: int | None = None,
    sort: str = "newest",
):
    query = db.query(Job)

    if q:
        query = _apply_search(query, q)
    query = _apply_filters(
        query, source, job_type, remote, location, salary_min, posted_within_days
    )

    total = query.count()
    query = _apply_sort(query, sort, q)
    jobs = query.offset((page - 1) * page_size).limit(page_size).all()
    pages = (total + page_size - 1) // page_size

    return jobs, total, pages