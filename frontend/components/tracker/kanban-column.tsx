"use client"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ApplicationCard } from "./application-card"
import type { Application, ApplicationStatus } from "@/types"
import { COLUMN_LABELS } from "@/types"

export function KanbanColumn({
  status,
  apps,
  onCardClick,
}: {
  status: ApplicationStatus
  apps: Application[]
  onCardClick: (app: Application) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col min-w-[220px] w-[220px]">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {COLUMN_LABELS[status]}
        </span>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {apps.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-2 rounded-lg p-2 min-h-[120px] transition-colors ${
          isOver ? "bg-primary/5 border-2 border-dashed border-primary/30" : "bg-muted/40"
        }`}
      >
        <SortableContext items={apps.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {apps.map((app) => (
            <ApplicationCard key={app.id} app={app} onClick={() => onCardClick(app)} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
