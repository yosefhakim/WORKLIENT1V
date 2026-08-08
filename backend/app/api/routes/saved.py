from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_client_id, get_db
from app.schemas.saved_job import SavedJobListResponse, SavedJobOut
from app.services.save_service import get_saved_jobs, save_job, unsave_job

router = APIRouter(prefix="/api", tags=["saved"])


@router.post("/jobs/{job_id}/save", response_model=SavedJobOut, status_code=201)
def save_job_endpoint(
    job_id: int,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """يحفظ فرصة للمستخدم المجهول."""
    saved_job = save_job(db, client_id, job_id)
    if saved_job is None:
        raise HTTPException(
            status_code=400, detail="Job not found or already saved"
        )
    return saved_job


@router.delete("/jobs/{job_id}/save", status_code=204)
def unsave_job_endpoint(
    job_id: int,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """يلغي حفظ فرصة."""
    success = unsave_job(db, client_id, job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Saved job not found")
    return None


@router.get("/saved", response_model=SavedJobListResponse)
def list_saved_jobs(
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """يجيب كل الفرص المحفوظة للمستخدم المجهول."""
    saved_jobs = get_saved_jobs(db, client_id)
    return SavedJobListResponse(items=saved_jobs, total=len(saved_jobs))