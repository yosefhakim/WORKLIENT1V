from fastapi import APIRouter

from app.api.routes import jobs, saved, sources

api_router = APIRouter()
api_router.include_router(jobs.router)
api_router.include_router(saved.router)
api_router.include_router(sources.router)