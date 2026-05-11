"use client"
import { useState, useEffect, useRef } from "react"
import { Search, Plus, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { slugify } from "@/lib/utils"
import { usePinCompany } from "@/hooks/use-watchlist"
import { toast } from "sonner"
import { api } from "@/lib/api"

type Suggestion = { id: string; name: string; logo_url: string }

export function CompanySearch({ pinnedIds }: { pinnedIds: Set<string> }) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const pin = usePinCompany()

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await api.companies.search(query)
        setSuggestions(data)
        setOpen(true)
      } catch {
        setSuggestions([])
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer.current)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handlePin(s: Suggestion) {
    if (pinnedIds.has(s.id)) return
    pin.mutate(
      { id: s.id, name: s.name, logo_url: s.logo_url },
      { onSuccess: () => toast.success(`Now tracking ${s.name}`) }
    )
    setQuery("")
    setOpen(false)
  }

  function handleManualAdd() {
    const name = query.trim()
    if (!name) return
    const id = slugify(name)
    const logo_url = `https://logo.clearbit.com/${id}.com`
    handlePin({ id, name, logo_url })
  }

  const showManual = query.trim().length >= 2 && !loading
  const manualAlreadyInSuggestions = suggestions.some(
    (s) => s.name.toLowerCase() === query.trim().toLowerCase()
  )

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search companies to track…"
          className="pl-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-md">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-muted cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img
                  src={s.logo_url}
                  alt={s.name}
                  className="size-6 rounded object-contain"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
                <span className="text-sm">{s.name}</span>
              </div>
              <Button
                size="sm"
                variant={pinnedIds.has(s.id) ? "secondary" : "default"}
                disabled={pinnedIds.has(s.id)}
                onClick={() => handlePin(s)}
              >
                {pinnedIds.has(s.id) ? "Tracking" : (
                  <><Plus className="size-3 mr-1" />Track</>
                )}
              </Button>
            </div>
          ))}

          {showManual && !manualAlreadyInSuggestions && (
            <div className="flex items-center justify-between px-3 py-2 border-t hover:bg-muted cursor-pointer">
              <span className="text-sm text-muted-foreground">
                Add &ldquo;{query.trim()}&rdquo; manually
              </span>
              <Button size="sm" variant="outline" onClick={handleManualAdd}>
                <Plus className="size-3 mr-1" />Add
              </Button>
            </div>
          )}

          {suggestions.length === 0 && !loading && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No matches found. Use &ldquo;Add manually&rdquo; below to track any company.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
