from datetime import timedelta

from app.database.session import SessionLocal
from app.models import Job
from app.models.job import utcnow

# (title, company, source, skills, salary_min, salary_max, remote, job_type, location)
RAW_JOBS = [
    ("Python Web Scraping Developer", "DataForge Labs", "upwork", ["Python", "BeautifulSoup", "Selenium"], 400, 800, True, "freelance", "Remote"),
    ("Senior Django Engineer", "TechBridge", "linkedin", ["Django", "PostgreSQL", "Redis"], 3000, 5000, False, "full_time", "Cairo, Egypt"),
    ("React Dashboard Developer", "PixelWorks", "upwork", ["React", "TypeScript", "Tailwind"], 600, 1200, True, "freelance", "Remote"),
    ("FastAPI Backend Developer", "CloudNine", "remoteok", ["FastAPI", "SQLAlchemy", "Docker"], 2500, 4500, True, "full_time", "Worldwide"),
    ("Data Extraction Specialist", "ScraperPro", "fiverr", ["Python", "Scrapy", "APIs"], 250, 600, True, "freelance", "Remote"),
    ("Automation Script Developer", "TaskMaster", "khamsat", ["Python", "Automation", "Selenium"], 100, 300, True, "freelance", "Remote"),
    ("Full-Stack Developer", "SouqTech", "mostaql", ["Django", "React", "PostgreSQL"], 1500, 2500, True, "full_time", "Remote"),
    ("Junior Python Developer", "NileSoft", "linkedin", ["Python", "Git", "SQL"], 800, 1200, False, "full_time", "Giza, Egypt"),
    ("Web Scraping Expert Needed", "MarketWatch", "upwork", ["Python", "BeautifulSoup", "Pandas"], 500, 900, True, "freelance", "Remote"),
    ("Backend Engineer - Payments", "PayFlow", "wellfound", ["Python", "FastAPI", "Stripe"], 4000, 6500, True, "full_time", "Remote"),
    ("API Integration Developer", "ConnectHub", "fiverr", ["Python", "REST API", "OAuth"], 300, 700, True, "freelance", "Remote"),
    ("Python Developer for E-commerce", "ShopLocal", "mostaql", ["Python", "Django", "Celery"], 1200, 2000, True, "freelance", "Remote"),
    ("Remote Data Engineer", "StreamData", "remoteok", ["Python", "Airflow", "SQL"], 3500, 5500, True, "full_time", "Anywhere"),
    ("Scraping & Parsing Gig", "QuickData", "khamsat", ["Python", "Regex", "JSON"], 50, 150, True, "freelance", "Remote"),
    ("Django REST Framework Dev", "AppFactory", "upwork", ["Django", "DRF", "JWT"], 800, 1500, True, "contract", "Remote"),
    ("Frontend Developer (React)", "UIStudio", "linkedin", ["React", "JavaScript", "CSS"], 2000, 3200, False, "full_time", "Cairo, Egypt"),
    ("Python Bot Developer", "TelegramTools", "fiverr", ["Python", "Telegram API", "Bots"], 150, 400, True, "freelance", "Remote"),
    ("Machine Learning Intern", "AIWorks", "wellfound", ["Python", "Pandas", "scikit-learn"], 500, 900, False, "internship", "Cairo, Egypt"),
    ("Senior Full-Stack Engineer", "FinEdge", "linkedin", ["Python", "React", "AWS"], 5000, 8000, True, "full_time", "Remote"),
    ("Web Automation Developer", "AutoFlow", "upwork", ["Python", "Playwright", "Selenium"], 700, 1300, True, "freelance", "Remote"),
    ("Freelance Python Script Fix", "CodeRescue", "khamsat", ["Python", "Debugging", "Git"], 25, 80, True, "freelance", "Remote"),
    ("Backend Developer - Logistics", "ShipSmart", "mostaql", ["FastAPI", "PostgreSQL", "Docker"], 1800, 2800, True, "full_time", "Remote"),
    ("Data Analyst (Python)", "InsightCo", "indeed", ["Python", "Pandas", "SQL"], 1500, 2400, False, "full_time", "Alexandria, Egypt"),
    ("React Native Mobile Dev", "MobiLab", "upwork", ["React Native", "TypeScript", "APIs"], 1000, 2000, True, "contract", "Remote"),
    ("Python Crawler Developer", "WebMiner", "remoteok", ["Python", "Scrapy", "MongoDB"], 2800, 4200, True, "full_time", "Worldwide"),
    ("Simple Data Entry Automation", "EasyTasks", "fiverr", ["Python", "Automation", "CSV"], 60, 120, True, "freelance", "Remote"),
    ("DevOps Engineer (Python)", "CloudOps", "linkedin", ["Python", "Kubernetes", "CI/CD"], 4000, 6000, True, "full_time", "Remote"),
    ("E-commerce Website Developer", "StoreBuilder", "mostaql", ["Django", "JavaScript", "Bootstrap"], 900, 1600, True, "freelance", "Remote"),
    ("Open Source Contributor - Scraper", "r/webscraping", "reddit", ["Python", "BeautifulSoup"], None, None, True, "freelance", "Remote"),
    ("Hiring: Python Backend Dev", "r/django", "reddit", ["Django", "PostgreSQL"], 2000, 3500, True, "full_time", "Remote"),
    ("Freelance Web Scraper", "r/forhire", "reddit", ["Python", "Scrapy", "Selenium"], 300, 700, True, "freelance", "Remote"),
    ("[For Hire] React Developer", "r/reactjs", "reddit", ["React", "TypeScript"], 500, 1000, True, "freelance", "Remote"),
    ("QA Automation Engineer", "TestPro", "indeed", ["Python", "Pytest", "Selenium"], 1800, 2800, False, "full_time", "Cairo, Egypt"),
    ("Flask Microservice Developer", "AppGrid", "upwork", ["Flask", "Docker", "Redis"], 600, 1100, True, "contract", "Remote"),
    ("Python Teacher / Mentor", "CodeCamp", "khamsat", ["Python", "Teaching"], 40, 90, True, "part_time", "Remote"),
    ("Startup CTO Advisor", "LaunchPad", "wellfound", ["Python", "Architecture", "AWS"], None, None, True, "part_time", "Remote"),
    ("GraphQL API Developer", "DataMesh", "remoteok", ["Python", "GraphQL", "FastAPI"], 3000, 4800, True, "full_time", "Anywhere"),
    ("WordPress + Python Integration", "SiteFix", "fiverr", ["Python", "WordPress", "REST API"], 200, 450, True, "freelance", "Remote"),
    ("Arabic NLP Developer", "LangTech", "mostaql", ["Python", "NLP", "Pandas"], 1400, 2200, True, "freelance", "Remote"),
    ("Senior Data Scientist", "Predicta", "linkedin", ["Python", "ML", "SQL"], 4500, 7000, True, "full_time", "Remote"),
    ("Bug Fix: Scrapy Spider", "FixIt", "upwork", ["Python", "Scrapy"], 100, 200, True, "freelance", "Remote"),
    ("Part-time Backend Developer", "EduPlatform", "indeed", ["Django", "MySQL"], 1000, 1500, False, "part_time", "Cairo, Egypt"),
    ("Real-time Chat App Developer", "ChatWorks", "upwork", ["FastAPI", "WebSockets", "Redis"], 900, 1700, True, "freelance", "Remote"),
    ("SEO Data Collector", "RankBoost", "khamsat", ["Python", "BeautifulSoup", "CSV"], 70, 160, True, "freelance", "Remote"),
    ("Platform Engineer", "ScaleUp", "wellfound", ["Python", "Terraform", "AWS"], 5000, 7500, True, "full_time", "Remote"),
    ("Freelance Django Developer", "r/django", "reddit", ["Django", "Celery", "Redis"], 800, 1400, True, "freelance", "Remote"),
    ("Computer Vision Developer", "VisionAI", "remoteok", ["Python", "OpenCV", "PyTorch"], 3500, 5200, True, "full_time", "Worldwide"),
    ("Integration Specialist - ERP", "BizTech", "mostaql", ["Python", "APIs", "SQL"], 1100, 1900, True, "contract", "Remote"),
]


def seed() -> None:
    db = SessionLocal()
    try:
        # نمسح أي بيانات قديمة عشان السكريبت يبقى قابل للتكرار
        db.query(Job).delete()

        now = utcnow()
        for i, row in enumerate(RAW_JOBS, start=1):
            title, company, source, skills, s_min, s_max, remote, job_type, location = row
            external_id = f"{source}-{i}"
            job = Job(
                external_id=external_id,
                source=source,
                source_url=f"https://{source}.com/opportunity/{external_id}",
                title=title,
                company=company,
                description=(
                    f"{company} is looking for a {title}. "
                    f"Key skills: {', '.join(skills)}."
                ),
                location=location,
                remote=remote,
                job_type=job_type,
                salary_min=s_min,
                salary_max=s_max,
                currency="USD",
                skills=skills,
                posted_at=now - timedelta(hours=i * 3),
            )
            db.add(job)

        db.commit()
        print(f"✅ Seeded {len(RAW_JOBS)} jobs.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()