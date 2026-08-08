from app.schemas.source import SourceOut


# قائمة المصادر المتاحة (هتتطور بعدين لما نضيف scrapers حقيقية)
SOURCES = [
    SourceOut(slug="upwork", name="Upwork", active=True, kind="freelance"),
    SourceOut(slug="fiverr", name="Fiverr", active=True, kind="freelance"),
    SourceOut(slug="khamsat", name="Khamsat", active=True, kind="freelance"),
    SourceOut(slug="mostaql", name="Mostaql", active=True, kind="freelance"),
    SourceOut(slug="remoteok", name="RemoteOK", active=True, kind="remote_jobs"),
    SourceOut(slug="linkedin", name="LinkedIn", active=True, kind="jobs"),
    SourceOut(slug="wellfound", name="Wellfound", active=True, kind="startup_jobs"),
    SourceOut(slug="indeed", name="Indeed", active=True, kind="jobs"),
    SourceOut(slug="reddit", name="Reddit", active=True, kind="social"),
]


def get_all_sources() -> list[SourceOut]:
    return SOURCES


def get_source_by_slug(slug: str) -> SourceOut | None:
    for source in SOURCES:
        if source.slug == slug:
            return source
    return None