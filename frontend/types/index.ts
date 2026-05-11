export type Company = {
  id: string
  name: string
  logo_url: string | null
  pinned_at: string
}

export type Job = {
  id: string
  company_id: string
  company_name: string
  title: string
  location: string
  salary: string | null
  type: "full-time" | "internship" | "contract" | "part-time"
  posted_at: string
  description: string
  apply_url: string
}

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "phone-screen"
  | "interview"
  | "offer"
  | "rejected"
  | "follow-up"

export const COLUMNS: ApplicationStatus[] = [
  "saved",
  "applied",
  "phone-screen",
  "interview",
  "offer",
  "rejected",
  "follow-up",
]

export const COLUMN_LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  "phone-screen": "Phone Screen",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  "follow-up": "Follow Up",
}

export type StatusHistoryEntry = {
  status: ApplicationStatus
  at: string
}

export type Application = {
  id: string
  company_name: string
  company_logo: string | null
  role_title: string
  location: string | null
  salary: string | null
  job_url: string | null
  status: ApplicationStatus
  status_history: StatusHistoryEntry[]
  interview_date: string | null
  notes: string | null
  flagged: boolean
  flag_reason: string | null
  added_at: string
  updated_at: string
}

export type ProgressStats = {
  total_this_month: number
  active: number
  interviews_secured: number
  response_rate: number
}
