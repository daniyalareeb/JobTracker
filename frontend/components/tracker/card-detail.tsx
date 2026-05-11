"use client"
import { useState } from "react"
import { Trash2, ExternalLink } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateApplication, useDeleteApplication } from "@/hooks/use-tracker"
import { COLUMNS, COLUMN_LABELS, type Application } from "@/types"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

export function CardDetail({
  app,
  open,
  onClose,
}: {
  app: Application | null
  open: boolean
  onClose: () => void
}) {
  const update = useUpdateApplication()
  const remove = useDeleteApplication()
  const [notes, setNotes] = useState("")

  function saveNotes() {
    if (!app || notes === app.notes) return
    update.mutate({ id: app.id, notes }, { onSuccess: () => toast.success("Notes saved") })
  }

  function handleDelete() {
    if (!app) return
    remove.mutate(app.id, {
      onSuccess: () => { toast.success("Deleted"); onClose() },
    })
  }

  if (!app) return null

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (!v) { saveNotes(); onClose() }
      }}
      direction="right"
    >
      <DrawerContent className="h-full w-full max-w-md ml-auto rounded-none">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DrawerTitle className="text-base">{app.role_title}</DrawerTitle>
              <DrawerDescription>{app.company_name}</DrawerDescription>
            </div>
            <Button size="icon" variant="ghost" className="text-destructive size-8" onClick={handleDelete}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <Select
            value={app.status}
            onValueChange={(v) => update.mutate({ id: app.id, status: v })}
          >
            <SelectTrigger className="mt-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLUMNS.map((col) => (
                <SelectItem key={col} value={col}>{COLUMN_LABELS[col]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-5">
          <div className="flex flex-col gap-5">
            {/* Meta */}
            <div className="flex flex-col gap-1.5 text-sm">
              {app.location && <p className="text-muted-foreground">📍 {app.location}</p>}
              {app.salary && <p className="text-muted-foreground">💰 {app.salary}</p>}
              {app.job_url && (
                <a href={app.job_url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline text-sm">
                  <ExternalLink className="size-3.5" />View posting
                </a>
              )}
            </div>

            {/* Interview date */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Interview date</label>
              <Input
                type="date"
                defaultValue={app.interview_date ? app.interview_date.slice(0, 10) : ""}
                onBlur={(e) =>
                  update.mutate({ id: app.id, interview_date: e.target.value || null })
                }
              />
            </div>

            {/* Status timeline */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Status history</p>
              <ol className="flex flex-col gap-1.5">
                {(app.status_history ?? []).map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span className="font-medium">{COLUMN_LABELS[h.status]}</span>
                    <span className="text-muted-foreground text-xs">{formatDate(h.at)}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
              <Textarea
                defaultValue={app.notes ?? ""}
                placeholder="Add notes…"
                className="resize-none"
                rows={5}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={saveNotes}
              />
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
