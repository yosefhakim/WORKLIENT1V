import os

# رابط قاعدة البيانات.
# SQLite افتراضياً للتطوير، وبعدين نقدر نبدل لـ PostgreSQL
# بمجرد تغيير متغير البيئة DATABASE_URL من غير ما نلمس الكود.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./worklient.db")