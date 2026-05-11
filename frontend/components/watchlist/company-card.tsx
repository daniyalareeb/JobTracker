"use client"
import { X, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useUnpinCompany } from "@/hooks/use-watchlist"
import { getLastVisit } from "@/hooks/use-jobs"
import { timeAgo } from "@/lib/utils"
import { toast } from "sonner"
import type { Company, Job } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import Link from "next/link"

export function CompanyCard({ company }: { company: Company }) {
  const unpin = useUnpinCompany()
  const { data } = useQuery({
    queryKey: ["jobs", company.id],
    queryFn: () => api.jobs.search(company.name),
    staleTime: 6 * 60 * 60 * 1000,
  })

  const jobs: Job[] = data?.jobs ?? []
  const lastVisit = getLastVisit()
  const newCount = lastVisit > 0 ? jobs.filter((j) => new Date(j.posted_at).getTime() > lastVisit).length : 0
  const hasNew = newCount > 0
  const latestJob = jobs[0]

  return (
    <div className="rounded-xl border bg-white shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={company.logo_url ?? `https://logo.clearbit.com/${company.name.toLowerCase().replace(/\s+/g, "")}.com`}
            alt={company.name}
            className="size-12 rounded-xl border object-contain p-0.5"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
          <div>
            <p className="font-semibold text-sm">{company.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {jobs.length} open role{jobs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            unpin.mutate(company.id, { onSuccess: () => toast.success(`Unpinned ${company.name}`) })
          }
          className="rounded-full p-1 hover:bg-muted transition-colors text-muted-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasNew && (
            <span className="text-xs rounded-full bg-primary/10 text-primary font-semibold px-2 py-0.5">
              {newCount} new
            </span>
          )}
          {latestJob ? (
            <span className="text-xs text-muted-foreground">Last: {timeAgo(latestJob.posted_at)}</span>
          ) : (
            <span className="text-xs text-muted-foreground">No listings cached</span>
          )}
        </div>
        <Link href="/feed" className="flex items-center gap-0.5 text-xs text-primary font-medium hover:underline">
          View jobs <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
