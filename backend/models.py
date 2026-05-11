from __future__ import annotations
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class StatusHistoryEntry(BaseModel):
    status: str
    at: str


class JobModel(BaseModel):
    id: str
    company_id: str
    company_name: str
    title: str
    location: str
    salary: Optional[str] = None
    type: str
    posted_at: str
    description: str
    apply_url: str


class CompanyCreate(BaseModel):
    id: str
    name: str
    logo_url: Optional[str] = None


class CompanyResponse(BaseModel):
    id: str
    name: str
    logo_url: Optional[str] = None
    pinned_at: str


class ApplicationCreate(BaseModel):
    company_name: str
    company_logo: Optional[str] = None
    role_title: str
    location: Optional[str] = None
    salary: Optional[str] = None
    job_url: Optional[str] = None
    status: str = "saved"


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    interview_date: Optional[str] = None
    company_logo: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    job_url: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: str
    company_name: str
    company_logo: Optional[str] = None
    role_title: str
    location: Optional[str] = None
    salary: Optional[str] = None
    job_url: Optional[str] = None
    status: str
    status_history: list[StatusHistoryEntry]
    interview_date: Optional[str] = None
    notes: Optional[str] = None
    flagged: bool
    flag_reason: Optional[str] = None
    added_at: str
    updated_at: str


class ProgressResponse(BaseModel):
    total_this_month: int
    active: int
    interviews_secured: int
    response_rate: float
