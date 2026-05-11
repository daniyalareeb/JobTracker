"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type FeedFilters = {
  keyword: string
  company: string
  type: string
  location: string
}

const JOB_TYPES = ["full-time", "internship", "contract", "part-time"]

export function FeedFilterBar({
  filters,
  companies,
  onChange,
}: {
  filters: FeedFilters
  companies: string[]
  onChange: (f: FeedFilters) => void
}) {
  function set(key: keyof FeedFilters, val: string) {
    onChange({ ...filters, [key]: val })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          className="pl-8 w-52"
          placeholder="Search roles…"
          value={filters.keyword}
          onChange={(e) => set("keyword", e.target.value)}
        />
      </div>

      <Select value={filters.company || "all"} onValueChange={(v) => set("company", v === "all" ? "" : v)}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All companies" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All companies</SelectItem>
          {companies.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.type || "all"} onValueChange={(v) => set("type", v === "all" ? "" : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {JOB_TYPES.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className="w-44"
        placeholder="Location…"
        value={filters.location}
        onChange={(e) => set("location", e.target.value)}
      />
    </div>
  )
}
