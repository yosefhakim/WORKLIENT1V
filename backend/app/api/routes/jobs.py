from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import Job
from app.schemas.job import JobListResponse, JobOut
from app.services.job_service import search_jobs, SORT_OPTIONS
from app.services.match_service import calculate_match_score, generate_match_reason

router = APIRouter(prefix="/api", tags=["jobs"])


def _add_match_info(job: Job, search_query: str | None = None) -> JobOut:
    """بيضيف match_score و match_reason للـ job."""
    job_dict = JobOut.model_validate(job).model_dump()
    job_dict["match_score"] = calculate_match_score(job, search_query)
    job_dict["match_reason"] = generate_match_reason(job, search_query)
    return JobOut(**job_dict)


@router.get("/jobs", response_model=JobListResponse)
def list_jobs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    q: str | None = Query(None, max_length=200),
    source: str | None = Query(None),
    job_type: str | None = Query(None),
    remote: bool | None = Query(None),
    location: str | None = Query(None),
    salary_min: int | None = Query(None, ge=0),
    posted_within_days: int | None = Query(None, ge=1, le=365),
    sort: str = Query("newest"),
    db: Session = Depends(get_db),
):
    """قائمة الفرص مع بحث وفلاتر وترتيب وpagination."""
    if sort not in SORT_OPTIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid sort. Allowed: {sorted(SORT_OPTIONS)}",
        )

    jobs, total, pages = search_jobs(
        db,
        page=page,
        page_size=page_size,
        q=q,
        source=source,
        job_type=job_type,
        remote=remote,
        location=location,
        salary_min=salary_min,
        posted_within_days=posted_within_days,
        sort=sort,
    )
    
    # نضيف match info لكل فرصة
    jobs_with_match = [_add_match_info(job, q) for job in jobs]
    
    return JobListResponse(
        items=jobs_with_match, total=total, page=page, page_size=page_size, pages=pages
    )


@router.get("/jobs/{job_id}", response_model=JobOut)
def get_job(
    job_id: int,
    q: str | None = Query(None, max_length=200),
    db: Session = Depends(get_db),
):
    """تفاصيل فرصة واحدة بالـ id."""
    job = db.get(Job, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return _add_match_info(job, q)