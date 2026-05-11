"use client"
import { useQueries } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Company, Job } from "@/types"
import { isWithin24h } from "@/lib/utils"

const LAST_VISIT_KEY = "jt_last_visit"

export function getLastVisit(): number {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem(LAST_VISIT_KEY) ?? "0", 10)
}

export function setLastVisit() {
  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_VISIT_KEY, Date.now().toString())
  }
}

export function useJobs(companies: Company[]) {
  const results = useQueries({
    queries: companies.map((c) => ({
      queryKey: ["jobs", c.id],
      queryFn: () => api.jobs.search(c.name),
      staleTime: 6 * 60 * 60 * 1000,
      enabled: !!c.id,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)
  const allJobs: Job[] = results
    .flatMap((r) => r.data?.jobs ?? [])
    .sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime())

  const lastVisit = getLastVisit()
  const newCount = lastVisit
    ? allJobs.filter((j) => new Date(j.posted_at).getTime() > lastVisit).length
    : 0

  return { jobs: allJobs, isLoading, newCount }
}
