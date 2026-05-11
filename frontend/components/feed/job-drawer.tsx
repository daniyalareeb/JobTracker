"use client"
import { ExternalLink, BookmarkPlus, ClipboardCheck } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCreateApplication } from "@/hooks/use-tracker"
import { toast } from "sonner"
import type { Job } from "@/types"

export function JobDrawer({
  job,
  open,
  onClose,
}: {
  job: Job | null
  open: boolean
  onClose: () => void
}) {
  const create = useCreateApplication()

  function logToTracker(status: "applied" | "saved") {
    if (!job) return
    create.mutate(
      {
        company_name: job.company_name,
        role_title: job.title,
        location: job.location,
        salary: job.salary,
        job_url: job.apply_url,
        status,
      },
      {
        onSuccess: () => {
          toast.success(
            status === "applied" ? "Logged to Applied" : "Saved for later",
            { description: `${job.title} at ${job.company_name}` }
          )
          onClose()
        },
        onError: () => toast.error("Failed to log — is the backend running?"),
      }
    )
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()} direction="right">
      <DrawerContent className="h-full w-full max-w-xl ml-auto rounded-none">
        {job && (
          <>
            <DrawerHeader className="border-b pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://logo.clearbit.com/${job.company_name.toLowerCase().replace(/\s+/g, "")}.com`}
                  alt={job.company_name}
                  className="size-10 rounded border object-contain"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
                <div>
                  <DrawerTitle className="text-base">{job.title}</DrawerTitle>
                  <DrawerDescription>{job.company_name} &middot; {job.location}</DrawerDescription>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => window.open(job.apply_url, "_blank")}
                >
                  <ExternalLink className="size-3.5 mr-1.5" />Apply
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => logToTracker("applied")}
                  disabled={create.isPending}
                >
                  <ClipboardCheck className="size-3.5 mr-1.5" />Log to Tracker
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => logToTracker("saved")}
                  disabled={create.isPending}
                >
                  <BookmarkPlus className="size-3.5 mr-1.5" />Save for Later
                </Button>
              </div>
            </DrawerHeader>
            <ScrollArea className="flex-1 p-6">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                {job.description || "No description available."}
              </div>
            </ScrollArea>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
