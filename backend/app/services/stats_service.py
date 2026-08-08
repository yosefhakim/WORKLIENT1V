from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Job, SavedJob


def get_dashboard_stats(db: Session, client_id: str) -> dict:
    """إحصائيات سريعة للـ Dashboard."""
    
    # عدد الفرص المحفوظة للمستخدم
    saved_count = db.query(SavedJob).filter(SavedJob.client_id == client_id).count()
    
    # إجمالي الفرص في القاعدة
    total_jobs = db.query(Job).count()
    
    # الفرص الجديدة في آخر 24 ساعة
    yesterday = datetime.now(timezone.utc) - timedelta(days=1)
    new_jobs_today = db.query(Job).filter(Job.posted_at >= yesterday).count()
    
    # الفرص اللي ليها راتب معروف
    with_salary = db.query(Job).filter(
        Job.salary_min.isnot(None),
        Job.salary_max.isnot(None),
    ).count()
    
    # الفرص الـ Remote
    remote_count = db.query(Job).filter(Job.remote == True).count()
    
    # أعلى المصادر عدداً
    top_sources_query = (
        db.query(Job.source, func.count(Job.id))
        .group_by(Job.source)
        .order_by(func.count(Job.id).desc())
        .limit(5)
        .all()
    )
    top_sources = [{"source": s, "count": c} for s, c in top_sources_query]
    
    # متوسط الراتب (لو فيه بيانات كفاية)
    avg_salary = db.query(func.avg(Job.salary_max)).filter(
        Job.salary_max.isnot(None)
    ).scalar()
    
    return {
        "saved_jobs": saved_count,
        "total_jobs": total_jobs,
        "new_jobs_today": new_jobs_today,
        "with_salary": with_salary,
        "remote_jobs": remote_count,
        "avg_max_salary": int(avg_salary) if avg_salary else None,
        "top_sources": top_sources,
    }