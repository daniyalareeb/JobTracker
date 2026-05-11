import type { Company, Job, Application, ProgressStats } from "@/types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

function getUserId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("jt_user_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("jt_user_id", id)
  }
  return id
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": getUserId(),
      ...init.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  watchlist: {
    list: () => request<Company[]>("/api/watchlist"),
    pin: (body: { id: string; name: string; logo_url?: string | null }) =>
      request<Company>("/api/watchlist", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    unpin: (id: string) =>
      request<void>(`/api/watchlist/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },

  jobs: {
    search: (company: string) =>
      request<{ jobs: Job[]; cached: boolean }>(`/api/jobs?company=${encodeURIComponent(company)}`),
  },

  tracker: {
    list: () => request<Application[]>("/api/tracker"),
    create: (body: {
      company_name: string
      company_logo?: string | null
      role_title: string
      location?: string | null
      salary?: string | null
      job_url?: string | null
      status?: string
    }) => request<Application>("/api/tracker", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<{
      status: string
      notes: string
      interview_date: string | null
      company_logo: string | null
      location: string | null
      salary: string | null
      job_url: string | null
    }>) =>
      request<Application>(`/api/tracker/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id: string) =>
      request<void>(`/api/tracker/${id}`, { method: "DELETE" }),
  },

  progress: {
    get: () => request<ProgressStats>("/api/progress"),
  },

  companies: {
    search: (q: string) =>
      request<{ id: string; name: string; logo_url: string }[]>(
        `/api/companies/search?q=${encodeURIComponent(q)}`
      ),
  },
}
