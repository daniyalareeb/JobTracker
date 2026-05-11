from datetime import datetime, timezone
from fastapi import APIRouter, Header, HTTPException
from database import get_db
from models import ApplicationCreate, ApplicationUpdate, ApplicationResponse, ProgressResponse
from services.follow_up import compute_flags

router = APIRouter()


def _require_user(x_user_id: str) -> str:
    if not x_user_id:
        raise HTTPException(status_code=400, detail="X-User-Id header required")
    return x_user_id


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("/tracker", response_model=list[ApplicationResponse])
def get_tracker(x_user_id: str = Header(...)):
    user_id = _require_user(x_user_id)
    db = get_db()
    result = (
        db.table("applications")
        .select("*")
        .eq("user_id", user_id)
        .order("added_at", desc=True)
        .execute()
    )
    apps = result.data or []
    apps = compute_flags(apps)

    # Persist updated flags back to DB in bulk
    for app in apps:
        db.table("applications").update({
            "flagged": app["flagged"],
            "flag_reason": app["flag_reason"],
        }).eq("id", app["id"]).execute()

    return apps


@router.post("/tracker", response_model=ApplicationResponse, status_code=201)
def create_application(body: ApplicationCreate, x_user_id: str = Header(...)):
    user_id = _require_user(x_user_id)
    db = get_db()
    now = _now_iso()
    row = {
        "user_id": user_id,
        "company_name": body.company_name,
        "company_logo": body.company_logo,
        "role_title": body.role_title,
        "location": body.location,
        "salary": body.salary,
        "job_url": body.job_url,
        "status": body.status,
        "status_history": [{"status": body.status, "at": now}],
        "flagged": False,
        "flag_reason": None,
        "added_at": now,
        "updated_at": now,
    }
    result = db.table("applications").insert(row).execute()
    return result.data[0]


@router.put("/tracker/{app_id}", response_model=ApplicationResponse)
def update_application(app_id: str, body: ApplicationUpdate, x_user_id: str = Header(...)):
    user_id = _require_user(x_user_id)
    db = get_db()

    existing = (
        db.table("applications")
        .select("*")
        .eq("id", app_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Application not found")

    current = existing.data
    updates: dict = {"updated_at": _now_iso()}

    if body.status is not None and body.status != current["status"]:
        updates["status"] = body.status
        history = current.get("status_history") or []
        history.append({"status": body.status, "at": updates["updated_at"]})
        updates["status_history"] = history

    for field in ("notes", "interview_date", "company_logo", "location", "salary", "job_url"):
        val = getattr(body, field)
        if val is not None:
            updates[field] = val

    result = db.table("applications").update(updates).eq("id", app_id).eq("user_id", user_id).execute()
    return result.data[0]


@router.delete("/tracker/{app_id}", status_code=204)
def delete_application(app_id: str, x_user_id: str = Header(...)):
    user_id = _require_user(x_user_id)
    db = get_db()
    db.table("applications").delete().eq("id", app_id).eq("user_id", user_id).execute()


@router.get("/progress", response_model=ProgressResponse)
def get_progress(x_user_id: str = Header(...)):
    user_id = _require_user(x_user_id)
    db = get_db()

    result = (
        db.table("applications")
        .select("status, added_at, status_history")
        .eq("user_id", user_id)
        .execute()
    )
    apps = result.data or []

    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total_this_month = 0
    active = 0
    interviews_secured = 0
    applied_count = 0
    responded_count = 0
    responded_statuses = {"phone-screen", "interview", "offer", "rejected"}

    for app in apps:
        status = app["status"]
        added_raw = app.get("added_at", "")

        try:
            added_at = datetime.fromisoformat(added_raw.replace("Z", "+00:00"))
            if added_at.tzinfo is None:
                added_at = added_at.replace(tzinfo=timezone.utc)
            if added_at >= month_start:
                total_this_month += 1
        except (ValueError, AttributeError):
            pass

        if status not in ("rejected", "offer"):
            active += 1

        history = app.get("status_history") or []
        if any(h.get("status") in ("interview", "offer") for h in history) or status in ("interview", "offer"):
            interviews_secured += 1

        if status == "applied":
            applied_count += 1
        if status in responded_statuses:
            responded_count += 1

    response_rate = round(responded_count / applied_count * 100, 1) if applied_count > 0 else 0.0

    return ProgressResponse(
        total_this_month=total_this_month,
        active=active,
        interviews_secured=interviews_secured,
        response_rate=response_rate,
    )
