from datetime import datetime, timezone, timedelta
from database import get_db
from services.jsearch import fetch_jobs

CACHE_TTL_HOURS = 6


async def refresh_all_companies():
    db = get_db()
    result = db.table("companies").select("id, name").execute()
    companies = result.data or []

    seen: dict[str, str] = {}
    for c in companies:
        if c["id"] not in seen:
            seen[c["id"]] = c["name"]

    if not seen:
        return

    now = datetime.now(timezone.utc)
    stale_threshold = now - timedelta(hours=CACHE_TTL_HOURS)

    for company_id, company_name in seen.items():
        cache_rows = (
            db.table("jobs_cache")
            .select("cached_at")
            .eq("company_id", company_id)
            .limit(1)
            .execute()
        )
        if cache_rows.data:
            try:
                cached_at = datetime.fromisoformat(
                    cache_rows.data[0]["cached_at"].replace("Z", "+00:00")
                )
                if cached_at.tzinfo is None:
                    cached_at = cached_at.replace(tzinfo=timezone.utc)
                if cached_at > stale_threshold:
                    continue
            except ValueError:
                pass

        try:
            jobs = await fetch_jobs(company_name)
            db.table("jobs_cache").upsert({
                "company_id": company_id,
                "jobs": jobs,
                "cached_at": now.isoformat(),
            }).execute()
            print(f"[scheduler] Refreshed {company_name}: {len(jobs)} jobs")
        except Exception as e:
            print(f"[scheduler] Failed to refresh {company_name}: {e}")
