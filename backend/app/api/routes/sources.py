from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_client_id, get_db
from app.schemas.dashboard import DashboardStatsOut
from app.schemas.source import SourcesListResponse
from app.services.source_registry import get_all_sources
from app.services.stats_service import get_dashboard_stats

router = APIRouter(prefix="/api", tags=["sources"])


@router.get("/sources", response_model=SourcesListResponse)
def list_sources():
    """قائمة كل المصادر المتاحة."""
    sources = get_all_sources()
    return SourcesListResponse(items=sources, total=len(sources))


@router.get("/dashboard/stats", response_model=DashboardStatsOut)
def dashboard_stats(
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """إحصائيات سريعة للـ Dashboard."""
    stats = get_dashboard_stats(db, client_id)
    return DashboardStatsOut(**stats)