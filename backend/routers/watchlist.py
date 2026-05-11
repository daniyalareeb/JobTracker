from datetime import datetime, timezone
from fastapi import APIRouter, Header, HTTPException
from database import get_db
from models import CompanyCreate, CompanyResponse

router = APIRouter()


def _require_user(x_user_id: str) -> str:
    if not x_user_id:
        raise HTTPException(status_code=400, detail="X-User-Id header required")
    return x_user_id


@router.get("/watchlist", response_model=list[CompanyResponse])
def get_watchlist(x_user_id: str = Header(...)):
    user_id = _require_user(x_user_id)
    db = get_db()
    result = (
        db.table("companies")
        .select("id, name, logo_url, pinned_at")
        .eq("user_id", user_id)
        .order("pinned_at", desc=False)
        .execute()
    )
    return result.data or []


@router.post("/watchlist", response_model=CompanyResponse, status_code=201)
def pin_company(body: CompanyCreate, x_user_id: str = Header(...)):
    user_id = _require_user(x_user_id)
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    row = {
        "id": body.id,
        "user_id": user_id,
        "name": body.name,
        "logo_url": body.logo_url,
        "pinned_at": now,
    }
    result = db.table("companies").upsert(row).execute()
    return result.data[0]


@router.delete("/watchlist/{company_id}", status_code=204)
def unpin_company(company_id: str, x_user_id: str = Header(...)):
    user_id = _require_user(x_user_id)
    db = get_db()
    db.table("companies").delete().eq("id", company_id).eq("user_id", user_id).execute()
