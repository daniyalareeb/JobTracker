"use client"
import { MapPin, Clock, Banknote, ChevronRight } from "lucide-react"
import { timeAgo, isWithin24h } from "@/lib/utils"
import type { Job } from "@/types"

const TYPE_COLORS: Record<string, string> = {
  "full-time": "bg-blue-50 text-blue-600 border-blue-100",
  internship: "bg-purple-50 text-purple-600 border-purple-100",
  contract: "bg-amber-50 text-amber-600 border-amber-100",
  "part-time": "bg-green-50 text-green-600 border-green-100",
}

export function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const isNew = isWithin24h(job.posted_at)
  return (
    <div
      onClick={onClick}
      className="rounded-xl border bg-white p-4 hover:shadow-md cursor-pointer transition-all group"
    >
      <div className="flex items-center gap-4">
        <img
          src={`https://logo.clearbit.com/${job.company_name.toLowerCase().replace(/\s+/g, "")}.com`}
          alt={job.company_name}
          className="size-11 rounded-xl border object-contain shrink-0 p-0.5"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{job.title}</p>
            {isNew && (
              <span className="text-xs rounded-full bg-primary/10 text-primary font-semibold px-2 py-0.5 shrink-0">
                New
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{job.company_name}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {job.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />{job.location.split(",")[0]}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Banknote className="size-3" />{job.salary}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />{timeAgo(job.posted_at)}
            </span>
            <span className={`text-xs border rounded-full px-2 py-0.5 ${TYPE_COLORS[job.type] ?? "bg-muted text-muted-foreground"}` }>
              {job.type}
            </span>
          </div>
        </div>
        <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </div>
  )
}
