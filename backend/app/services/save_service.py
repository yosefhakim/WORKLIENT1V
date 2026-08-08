from sqlalchemy.orm import Session

from app.models import Job, SavedJob


def save_job(db: Session, client_id: str, job_id: int) -> SavedJob | None:
    """يحفظ فرصة للمستخدم المجهول. لو محفوظة بالفعل، يرجع None."""
    # تأكد إن الفرصة موجودة
    job = db.get(Job, job_id)
    if job is None:
        return None

    # تأكد إنها مش محفوظة بالفعل
    existing = (
        db.query(SavedJob)
        .filter(SavedJob.client_id == client_id, SavedJob.job_id == job_id)
        .first()
    )
    if existing:
        return None

    saved_job = SavedJob(client_id=client_id, job_id=job_id)
    db.add(saved_job)
    db.commit()
    db.refresh(saved_job)
    return saved_job


def unsave_job(db: Session, client_id: str, job_id: int) -> bool:
    """يلغي حفظ فرصة. يرجع True لو اتلغت، False لو مش موجودة."""
    saved_job = (
        db.query(SavedJob)
        .filter(SavedJob.client_id == client_id, SavedJob.job_id == job_id)
        .first()
    )
    if saved_job is None:
        return False

    db.delete(saved_job)
    db.commit()
    return True


def get_saved_jobs(db: Session, client_id: str) -> list[SavedJob]:
    """يجيب كل الفرص المحفوظة للمستخدم المجهول."""
    return (
        db.query(SavedJob)
        .filter(SavedJob.client_id == client_id)
        .order_by(SavedJob.created_at.desc())
        .all()
    )


def is_job_saved(db: Session, client_id: str, job_id: int) -> bool:
    """يتحقق لو فرصة معينة محفوظة للمستخدم."""
    return (
        db.query(SavedJob)
        .filter(SavedJob.client_id == client_id, SavedJob.job_id == job_id)
        .first()
        is not None
    )