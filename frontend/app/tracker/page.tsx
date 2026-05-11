"use client"
import { useState } from "react"
import { AlertCircle, KanbanSquare } from "lucide-react"
import { useTracker, flaggedCount } from "@/hooks/use-tracker"
import { KanbanBoard } from "@/components/tracker/kanban-board"
import { AddApplication } from "@/components/tracker/add-application"
import { Loader2 } from "lucide-react"

export default function TrackerPage() {
  const { data: apps = [], isLoading } = useTracker()
  const [showFlagged, setShowFlagged] = useState(false)
  const flagged = flaggedCount(apps)
  const visible = showFlagged ? apps.filter((a) => a.flagged) : apps

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <p className="text-muted-foreground text-sm">
          {apps.length} application{apps.length !== 1 ? "s" : ""} tracked
        </p>
        <AddApplication />
      </div>

      {flagged > 0 && (
        <button
          onClick={() => setShowFlagged((v) => !v)}
          className="flex items-center gap-2.5 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 mb-5 text-sm text-orange-700 font-medium hover:bg-orange-100 transition-colors shrink-0 text-left"
        >
          <AlertCircle className="size-4" />
          {flagged} application{flagged !== 1 ? "s" : ""} need attention
          <span className="text-orange-400 ml-auto text-xs">
            {showFlagged ? "Show all →" : "Show flagged →"}
          </span>
        </button>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground justify-center py-16">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading tracker…</span>
        </div>
      ) : apps.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-16 text-center">
          <KanbanSquare className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-medium">No applications tracked yet</p>
          <p className="text-muted-foreground text-sm mt-1">Click &ldquo;Add Application&rdquo; or log one from the Feed.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard apps={visible} />
        </div>
      )}
    </div>
  )
}
