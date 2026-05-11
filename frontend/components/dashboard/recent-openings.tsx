"use client"
import Link from "next/link"
import { ChevronRight, MapPin } from "lucide-react"
import { timeAgo, isWithin24h } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Job } from "@/types"

const TYPE_COLORS: Record<string, string> = {
  "full-time": "bg-blue-50 text-blue-600 border-blue-100",
  internship: "bg-purple-50 text-purple-600 border-purple-100",
  contract: "bg-amber-50 text-amber-600 border-amber-100",
  "part-time": "bg-green-50 text-green-600 border-green-100",
}

export function RecentOpenings({ jobs }: { jobs: Job[] }) {
  const shown = jobs.slice(0, 5)
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h2 className="font-semibold text-base">New Openings</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Today &bull; {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <Link href="/feed" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="divide-y">
        {shown.length === 0 ? (
          <p className="text-sm text-muted-foreground px-5 py-8 text-center">
            Pin companies to see openings here.
          </p>
        ) : (
          shown.map((job) => (
            <Link key={job.id} href="/feed" className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors group">
              <img
                src={`https://logo.clearbit.com/${job.company_name.toLowerCase().replace(/\s+/g, "")}.com`}
                alt={job.company_name}
                className="size-10 rounded-lg border object-contain shrink-0"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.company_name}</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {job.location && (
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <MapPin className="size-3" />{job.location.split(",")[0]}
                    </span>
                  )}
                  <span className={`text-xs border rounded-full px-2 py-0.5 ${TYPE_COLORS[job.type] ?? ""}`}>
                    {job.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">{timeAgo(job.posted_at)}</span>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))
        )}
      </div>
      {shown.length > 0 && (
        <div className="px-5 py-3 border-t">
          <Link href="/feed" className="flex items-center justify-center gap-1.5 text-sm text-primary font-medium hover:underline">
            View all openings <ChevronRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
