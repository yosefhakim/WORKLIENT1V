from app.models import Job


def calculate_match_score(job: Job, search_query: str | None = None) -> int:
    """
    يحسب درجة المطابقة (0-100) بناءً على:
    - كلمة البحث في العنوان (40 نقطة)
    - كلمة البحث في المهارات (30 نقطة)
    - كلمة البحث في الوصف (20 نقطة)
    - وجود معلومات الراتب (10 نقاط)
    """
    score = 0
    
    if not search_query:
        # لو مفيش بحث، ندي score أساسي بناءً على اكتمال البيانات
        if job.salary_min is not None and job.salary_max is not None:
            score += 50
        if job.skills and len(job.skills) > 0:
            score += 30
        if job.description:
            score += 20
        return min(score, 100)
    
    query_lower = search_query.lower()
    
    # العنوان (أهم حاجة)
    if job.title and query_lower in job.title.lower():
        score += 40
    
    # المهارات
    if job.skills:
        skills_text = " ".join(job.skills).lower()
        if query_lower in skills_text:
            score += 30
    
    # الوصف
    if job.description and query_lower in job.description.lower():
        score += 20
    
    # معلومات الراتب (bonus)
    if job.salary_min is not None or job.salary_max is not None:
        score += 10
    
    return min(score, 100)


def generate_match_reason(job: Job, search_query: str | None = None) -> str:
    """
    يولد شرح بسيط لدرجة المطابقة.
    """
    reasons = []
    
    if search_query:
        query_lower = search_query.lower()
        
        # فحص العنوان
        if job.title and query_lower in job.title.lower():
            reasons.append(f"العنوان يحتوي على '{search_query}'")
        
        # فحص المهارات
        if job.skills:
            matching_skills = [
                skill for skill in job.skills 
                if query_lower in skill.lower()
            ]
            if matching_skills:
                skills_str = ", ".join(matching_skills[:3])
                reasons.append(f"المهارات المطابقة: {skills_str}")
    
    # أسباب عامة
    if job.remote:
        reasons.append("فرصة عن بُعد")
    
    if job.salary_min is not None and job.salary_max is not None:
        reasons.append(f"الراتب: ${job.salary_min}-${job.salary_max}")
    
    if not reasons:
        return "فرصة متاحة - راجع التفاصيل للمزيد"
    
    return " | ".join(reasons[:3])  # أول 3 أسباب بس