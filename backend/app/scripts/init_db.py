from app.database.session import Base, engine
from app.models import Job  # noqa: F401 - الاستيراد ده بيسجل الموديل عند Base


def main() -> None:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created.")


if __name__ == "__main__":
    main()