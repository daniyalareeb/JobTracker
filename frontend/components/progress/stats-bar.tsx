"use client"
import { Briefcase, Activity, TrendingUp, BarChart2 } from "lucide-react"
import type { ProgressStats } from "@/types"

const CARDS = [
  { key: "total_this_month" as const, label: "This Month", sub: "applications", iconBg: "bg-blue-50", iconColor: "text-blue-500", icon: Briefcase },
  { key: "active" as const, label: "Active", sub: "in pipeline", iconBg: "bg-green-50", iconColor: "text-green-500", icon: Activity },
  { key: "interviews_secured" as const, label: "Interviews", sub: "secured", iconBg: "bg-purple-50", iconColor: "text-purple-500", icon: TrendingUp },
  { key: "response_rate" as const, label: "Response Rate", sub: "of applied", iconBg: "bg-amber-50", iconColor: "text-amber-500", icon: BarChart2, suffix: "%" },
]

export function StatsBar({ stats }: { stats: ProgressStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, sub, iconBg, iconColor, icon: Icon, suffix }) => (
        <div key={key} className="rounded-xl border bg-white shadow-sm p-5 flex items-center gap-4">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`size-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats[key]}{suffix ?? ""}</p>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
