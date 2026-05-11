from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Header, HTTPException, Query
from database import get_db
from services.jsearch import fetch_jobs

router = APIRouter()

CACHE_TTL_HOURS = 6


def _slug(name: str) -> str:
    return name.lower().replace(" ", "-")


def _is_cache_valid(cached_at_str: str) -> bool:
    try:
        cached_at = datetime.fromisoformat(cached_at_str.replace("Z", "+00:00"))
        if cached_at.tzinfo is None:
            cached_at = cached_at.replace(tzinfo=timezone.utc)
        return datetime.now(timezone.utc) - cached_at < timedelta(hours=CACHE_TTL_HOURS)
    except ValueError:
        return False


@router.get("/jobs")
async def get_jobs(
    company: str = Query(..., min_length=1),
    x_user_id: str = Header(...),
):
    if not x_user_id:
        raise HTTPException(status_code=400, detail="X-User-Id header required")

    db = get_db()
    company_id = _slug(company)

    cache_rows = (
        db.table("jobs_cache")
        .select("jobs, cached_at")
        .eq("company_id", company_id)
        .limit(1)
        .execute()
    )

    if cache_rows.data and _is_cache_valid(cache_rows.data[0]["cached_at"]):
        return {"jobs": cache_rows.data[0]["jobs"], "cached": True}

    jobs = await fetch_jobs(company)

    db.table("jobs_cache").upsert({
        "company_id": company_id,
        "jobs": jobs,
        "cached_at": datetime.now(timezone.utc).isoformat(),
    }).execute()

    return {"jobs": jobs, "cached": False}
