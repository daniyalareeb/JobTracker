import type { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  sub,
  subColor = "text-muted-foreground",
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string
  value: string | number
  sub: string
  subColor?: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm">
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`size-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className={`text-xs mt-0.5 font-medium ${subColor}`}>{sub}</p>
      </div>
    </div>
  )
}
