"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { slugify } from "@/lib/utils"

export function useWatchlist() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: api.watchlist.list,
  })
}

export function usePinCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (company: { id: string; name: string; logo_url?: string | null }) =>
      api.watchlist.pin(company),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  })
}

export function useUnpinCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.watchlist.unpin(id),
    onSettled: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  })
}

export function useCompanyJobCount(companyId: string) {
  const { data } = useQuery({
    queryKey: ["jobs", companyId],
    queryFn: () => api.jobs.search(companyId.replace(/-/g, " ")),
    staleTime: 6 * 60 * 60 * 1000,
    enabled: !!companyId,
  })
  return data?.jobs?.length ?? 0
}
