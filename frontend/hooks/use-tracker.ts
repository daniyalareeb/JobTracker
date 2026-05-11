"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Application } from "@/types"

export function useTracker() {
  return useQuery({
    queryKey: ["tracker"],
    queryFn: api.tracker.list,
  })
}

export function useCreateApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.tracker.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracker"] }),
  })
}

export function useUpdateApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Parameters<typeof api.tracker.update>[1]) =>
      api.tracker.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracker"] }),
  })
}

export function useDeleteApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.tracker.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracker"] }),
  })
}

export function useProgress() {
  return useQuery({
    queryKey: ["progress"],
    queryFn: api.progress.get,
  })
}

export function flaggedCount(apps: Application[]): number {
  return apps.filter((a) => a.flagged).length
}
