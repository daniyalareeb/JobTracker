"use client"
import { useTracker, useProgress } from "@/hooks/use-tracker"
import { StatsBar } from "@/components/progress/stats-bar"
import { Loader2, BarChart2 } from "lucide-react"
import { COLUMN_LABELS, type ApplicationStatus } from "@/types"

export default function ProgressPage() {
  const { data: stats, isLoading: statsLoading } = useProgress()
  const { data: apps = [] } = useTracker()

  const byStatus = Object.entries(COLUMN_LABELS).map(([status, label]) => ({
    status: status as ApplicationStatus,
    label,
    count: apps.filter((a) => a.status === status).length,
  }))

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      {statsLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading stats…</span>
        </div>
      ) : stats ? (
        <StatsBar stats={stats} />
      ) : (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <BarChart2 className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-medium">No data yet</p>
          <p className="text-muted-foreground text-sm mt-1">Start tracking applications to see your progress.</p>
        </div>
      )}

      {apps.length > 0 && (
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <h2 className="text-sm font-semibold mb-5 text-foreground">Breakdown by status</h2>
          <div className="flex flex-col gap-3">
            {byStatus.map(({ status, label, count }) => (
              <div key={status} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-32 shrink-0">{label}</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: apps.length ? `${(count / apps.length) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-sm font-semibold w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
