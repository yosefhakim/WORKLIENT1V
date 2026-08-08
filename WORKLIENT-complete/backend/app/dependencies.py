from collections.abc import Generator
from uuid import uuid4

from fastapi import Header
from sqlalchemy.orm import Session

from app.database.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """بيفتح جلسة قاعدة بيانات لكل طلب، ويقفلها بعد ما الطلب يخلص."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_client_id(x_client_id: str | None = Header(None)) -> str:
    """
    بياخد الـ client_id من الـ header.
    لو مش موجود، بيولد UUID مؤقت (للتجربة بس).
    """
    if x_client_id is None:
        return str(uuid4())
    return x_client_id