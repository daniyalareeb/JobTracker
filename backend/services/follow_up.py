from datetime import datetime, timezone, timedelta


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _parse(ts: str | None) -> datetime | None:
    if not ts:
        return None
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except ValueError:
        return None


def compute_flags(apps: list[dict]) -> list[dict]:
    now = _now()
    for app in apps:
        status = app.get("status", "")
        updated_at = _parse(app.get("updated_at"))
        interview_date = _parse(app.get("interview_date"))

        flagged = False
        reason = None

        if status == "applied" and updated_at and (now - updated_at) > timedelta(days=14):
            flagged = True
            reason = "Might need follow-up"
        elif status == "phone-screen" and updated_at and (now - updated_at) > timedelta(days=7):
            flagged = True
            reason = "Chase this"
        elif status == "interview" and interview_date and interview_date < now:
            flagged = True
            reason = "Update your status"

        app["flagged"] = flagged
        app["flag_reason"] = reason
    return apps
