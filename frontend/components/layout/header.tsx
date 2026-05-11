"use client"
import { usePathname } from "next/navigation"
import { Bell } from "lucide-react"

const TITLES: Record<string, string> = {
  "/": "Home",
  "/companies": "Track Companies",
  "/feed": "Job Openings",
  "/tracker": "My Applications",
  "/progress": "My Stats",
}

function getTitle(pathname: string): string {
  for (const [key, val] of Object.entries(TITLES)) {
    if (key === "/" ? pathname === "/" : pathname.startsWith(key)) return val
  }
  return "JobsTrack"
}

export function Header() {
  const pathname = usePathname()
  const title = getTitle(pathname)

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8 shrink-0">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="relative flex size-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <Bell className="size-4 text-muted-foreground" />
        </button>
        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          J
        </div>
      </div>
    </header>
  )
}
