"use client"
import { useState } from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateApplication } from "@/hooks/use-tracker"
import { COLUMNS, COLUMN_LABELS } from "@/types"
import { toast } from "sonner"

export function AddApplication() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    company_name: "",
    role_title: "",
    job_url: "",
    status: "saved",
  })
  const create = useCreateApplication()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company_name || !form.role_title) return
    create.mutate(
      { ...form, job_url: form.job_url || null },
      {
        onSuccess: () => {
          toast.success("Application added")
          setOpen(false)
          setForm({ company_name: "", role_title: "", job_url: "", status: "saved" })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-3.5 mr-1.5" />Add Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-3 mt-2">
          <Input
            placeholder="Company name *"
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            required
          />
          <Input
            placeholder="Role title *"
            value={form.role_title}
            onChange={(e) => setForm({ ...form, role_title: e.target.value })}
            required
          />
          <Input
            placeholder="Job URL (optional)"
            value={form.job_url}
            onChange={(e) => setForm({ ...form, job_url: e.target.value })}
          />
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLUMNS.map((col) => (
                <SelectItem key={col} value={col}>{COLUMN_LABELS[col]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={create.isPending}>Add</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
