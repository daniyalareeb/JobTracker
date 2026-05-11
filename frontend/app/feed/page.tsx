"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useJobs, setLastVisit } from "@/hooks/use-jobs"
import { JobCard } from "@/components/feed/job-card"
import { JobDrawer } from "@/components/feed/job-drawer"
import { FeedFilterBar, type FeedFilters } from "@/components/feed/feed-filters"
import { Loader2, Bell, Rss } from "lucide-react"
import type { Job } from "@/types"

const PAGE_SIZE = 20

export default function FeedPage() {
  const { data: companies = [] } = useWatchlist()
  const { jobs, isLoading, newCount } = useJobs(companies)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<FeedFilters>({
    keyword: "",
    company: "",
    type: "",
    location: "",
  })
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && jobs.length > 0) setLastVisit()
  }, [isLoading, jobs.length])

  const filtered = jobs.filter((j) => {
    if (filters.keyword && !j.title.toLowerCase().includes(filters.keyword.toLowerCase()) &&
      !j.company_name.toLowerCase().includes(filters.keyword.toLowerCase())) return false
    if (filters.company && j.company_name !== filters.company) return false
    if (filters.type && j.type !== filters.type) return false
    if (filters.location && !j.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    return true
  })

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const companyNames = Array.from(new Set(jobs.map((j) => j.company_name))).sort()

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && visible.length < filtered.length) setPage((p) => p + 1)
    },
    [visible.length, filtered.length]
  )

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(onIntersect, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [onIntersect])

  useEffect(() => { setPage(1) }, [filters])

  return (
    <div className="max-w-3xl">
      <div className="mb-5">
        <p className="text-muted-foreground text-sm">
          {companies.length === 0
            ? "Track companies to see their latest openings here."
            : `Showing openings from ${companies.length} tracked compan${companies.length === 1 ? "y" : "ies"}`}
        </p>
      </div>

      {newCount > 0 && (
        <div className="flex items-center gap-2.5 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 mb-5 text-sm text-primary font-medium">
          <Bell className="size-4" />
          {newCount} new role{newCount !== 1 ? "s" : ""} since your last visit
        </div>
      )}

      <div className="rounded-xl border bg-white shadow-sm mb-5 p-4">
        <FeedFilterBar filters={filters} companies={companyNames} onChange={setFilters} />
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-16 justify-center">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading jobs…</span>
        </div>
      ) : companies.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-16 text-center">
          <Rss className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-medium">No companies tracked yet</p>
          <p className="text-muted-foreground text-sm mt-1">Go to <strong>Track Companies</strong>, search for a company, and add it — their openings will appear here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <p className="text-muted-foreground text-sm">No jobs match your filters.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
          ))}
          <div ref={sentinelRef} className="h-2" />
        </div>
      )}

      <JobDrawer
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  )
}
