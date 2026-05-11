"use client"
import Link from "next/link"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { getLastVisit } from "@/hooks/use-jobs"
import type { Job } from "@/types"

function CompanyRow({ companyId, companyName }: { companyId: string; companyName: string }) {
  const { data } = useQuery({
    queryKey: ["jobs", companyId],
    queryFn: () => api.jobs.search(companyName),
    staleTime: 6 * 60 * 60 * 1000,
  })
  const jobs: Job[] = data?.jobs ?? []
  const lastVisit = getLastVisit()
  const newCount = lastVisit > 0 ? jobs.filter((j) => new Date(j.posted_at).getTime() > lastVisit).length : 0

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors">
      <img
        src={`https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s+/g, "")}.com`}
        alt={companyName}
        className="size-8 rounded-lg border object-contain shrink-0"
        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
      />
      <span className="flex-1 text-sm font-medium truncate">{companyName}</span>
      <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
        newCount > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      }`}>
        {newCount > 0 ? `${newCount} new` : "0 new"}
      </span>
    </div>
  )
}

export function TrackedCompaniesPanel() {
  const { data: companies = [] } = useWatchlist()

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="font-semibold text-base">Tracked Companies</h2>
        <Link href="/companies" className="text-xs font-medium text-primary hover:underline">View all</Link>
      </div>
      <div className="divide-y">
        {companies.length === 0 ? (
          <p className="text-sm text-muted-foreground px-5 py-8 text-center">
            No companies pinned yet.
          </p>
        ) : (
          companies.slice(0, 6).map((c) => (
            <CompanyRow key={c.id} companyId={c.id} companyName={c.name} />
          ))
        )}
      </div>
    </div>
  )
}
