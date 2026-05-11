"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Rss,
  KanbanSquare,
  BarChart2,
  Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/companies", label: "Track Companies", icon: Building2 },
  { href: "/feed", label: "Job Openings", icon: Rss },
  { href: "/tracker", label: "My Applications", icon: KanbanSquare },
  { href: "/progress", label: "My Stats", icon: BarChart2 },
]

export function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-screen w-60 flex-col bg-primary text-primary-foreground shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-white/20">
          <Briefcase className="size-5" />
        </div>
        <div>
          <p className="font-bold text-base leading-tight">JobsTrack</p>
          <p className="text-[11px] text-white/60 leading-tight">Find. Track. Grow.</p>
        </div>
      </div>

      <div className="mx-4 border-b border-white/10" />

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Stay updated promo */}
      <div className="m-3 rounded-xl bg-white/10 p-4 text-center">
        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-white/20">
          <Rss className="size-4" />
        </div>
        <p className="text-xs font-semibold">Get started!</p>
        <p className="text-[11px] text-white/60 mt-0.5 leading-snug">
          Track companies to see their latest openings in one place.
        </p>
        <Link
          href="/companies"
          className="mt-3 block rounded-lg bg-white/20 py-1.5 text-xs font-medium hover:bg-white/30 transition-colors"
        >
          Track a Company
        </Link>
      </div>
    </aside>
  )
}
