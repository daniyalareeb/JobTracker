"use client"
import { useWatchlist } from "@/hooks/use-watchlist"
import { CompanySearch } from "@/components/watchlist/company-search"
import { CompanyCard } from "@/components/watchlist/company-card"
import { Loader2, Building2 } from "lucide-react"

export default function CompaniesPage() {
  const { data: companies = [], isLoading } = useWatchlist()
  const pinnedIds = new Set(companies.map((c) => c.id))

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm mt-1">
            {companies.length === 0 ? "Search for a company below to start tracking openings" : `${companies.length} compan${companies.length !== 1 ? "ies" : "y"} tracked`}
          </p>
        </div>
        <CompanySearch pinnedIds={pinnedIds} />
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading…</span>
        </div>
      ) : companies.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-16 text-center">
          <Building2 className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-medium text-foreground">No companies tracked yet</p>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
            Use the search box above — type a company name and select it from the dropdown to start tracking their job openings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      )}
    </div>
  )
}
