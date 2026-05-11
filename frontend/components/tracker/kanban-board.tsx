"use client"
import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"
import { TooltipProvider } from "@/components/ui/tooltip"
import { KanbanColumn } from "./kanban-column"
import { CardDetail } from "./card-detail"
import { useUpdateApplication } from "@/hooks/use-tracker"
import { COLUMNS, type Application, type ApplicationStatus } from "@/types"

export function KanbanBoard({ apps }: { apps: Application[] }) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const update = useUpdateApplication()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const cardId = active.id as string
    const targetCol = over.id as ApplicationStatus
    const card = apps.find((a) => a.id === cardId)
    if (!card || card.status === targetCol) return
    update.mutate({ id: cardId, status: targetCol })
  }

  const byStatus = (status: ApplicationStatus) => apps.filter((a) => a.status === status)

  return (
    <TooltipProvider delayDuration={300}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col}
              status={col}
              apps={byStatus(col)}
              onCardClick={setSelectedApp}
            />
          ))}
        </div>
      </DndContext>
      <CardDetail
        app={selectedApp}
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </TooltipProvider>
  )
}
