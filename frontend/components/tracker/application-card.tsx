"use client"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AlertCircle, Calendar } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { daysSince, timeAgo } from "@/lib/utils"
import type { Application } from "@/types"

export function ApplicationCard({
  app,
  onClick,
}: {
  app: Application
  onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: app.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const interviewDate = app.interview_date ? new Date(app.interview_date) : null
  const interviewDaysLeft = interviewDate
    ? Math.ceil((interviewDate.getTime() - Date.now()) / 86400000)
    : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="rounded-md border bg-white p-3 cursor-pointer hover:shadow-sm transition-shadow select-none"
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={app.company_logo ?? `https://logo.clearbit.com/${app.company_name.toLowerCase().replace(/\s+/g, "")}.com`}
            alt={app.company_name}
            className="size-6 rounded object-contain shrink-0"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{app.role_title}</p>
            <p className="text-xs text-muted-foreground truncate">{app.company_name}</p>
          </div>
        </div>
        {app.flagged && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="size-4 text-orange-500 shrink-0" />
            </TooltipTrigger>
            <TooltipContent>{app.flag_reason}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Added {timeAgo(app.added_at)}</span>
        {interviewDaysLeft !== null && interviewDaysLeft >= 0 && (
          <span className="flex items-center gap-1 text-primary font-medium">
            <Calendar className="size-3" />
            {interviewDaysLeft === 0 ? "Today" : `${interviewDaysLeft}d`}
          </span>
        )}
      </div>
    </div>
  )
}
