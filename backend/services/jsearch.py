import os
import httpx
from datetime import datetime

JSEARCH_HOST = "jsearch.p.rapidapi.com"
JSEARCH_BASE = f"https://{JSEARCH_HOST}"


def _employment_type(raw: str) -> str:
    mapping = {
        "FULLTIME": "full-time",
        "PARTTIME": "part-time",
        "CONTRACTOR": "contract",
        "INTERN": "internship",
    }
    return mapping.get(raw.upper() if raw else "", "full-time")


def _safe_salary(job: dict) -> str | None:
    min_s = job.get("job_min_salary")
    max_s = job.get("job_max_salary")
    currency = job.get("job_salary_currency", "USD")
    period = job.get("job_salary_period", "")
    if min_s and max_s:
        return f"{currency} {int(min_s):,}–{int(max_s):,} {period}".strip()
    if min_s:
        return f"{currency} {int(min_s):,}+ {period}".strip()
    return None


def _parse_posted_at(job: dict) -> str:
    raw = job.get("job_posted_at_datetime_utc")
    if raw:
        return raw
    ts = job.get("job_posted_at_timestamp")
    if ts:
        return datetime.utcfromtimestamp(ts).isoformat() + "Z"
    return datetime.utcnow().isoformat() + "Z"


async def fetch_jobs(company: str) -> list[dict]:
    api_key = os.environ["JSEARCH_API_KEY"]
    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": JSEARCH_HOST,
    }
    params = {
        "query": f"{company} jobs",
        "page": "1",
        "num_pages": "1",
        "date_posted": "all",
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(f"{JSEARCH_BASE}/search", headers=headers, params=params)
        resp.raise_for_status()
        data = resp.json().get("data", [])

    company_slug = company.lower().replace(" ", "-")
    jobs = []
    for item in data:
        jobs.append({
            "id": item.get("job_id", ""),
            "company_id": company_slug,
            "company_name": item.get("employer_name", company),
            "title": item.get("job_title", ""),
            "location": ", ".join(filter(None, [
                item.get("job_city"),
                item.get("job_state"),
                item.get("job_country"),
            ])),
            "salary": _safe_salary(item),
            "type": _employment_type(item.get("job_employment_type", "")),
            "posted_at": _parse_posted_at(item),
            "description": item.get("job_description", ""),
            "apply_url": item.get("job_apply_link", ""),
        })
    return jobs
