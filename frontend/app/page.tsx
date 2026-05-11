"use client"
import Link from "next/link"
import { Briefcase, Building2, Target, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentOpenings } from "@/components/dashboard/recent-openings"
import { TrackedCompaniesPanel } from "@/components/dashboard/tracked-companies-panel"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useJobs } from "@/hooks/use-jobs"
import { useTracker } from "@/hooks/use-tracker"
import { useProgress } from "@/hooks/use-tracker"

export default function DashboardPage() {
  const { data: companies = [] } = useWatchlist()
  const { jobs, newCount } = useJobs(companies)
  const { data: apps = [] } = useTracker()
  const { data: stats } = useProgress()

  const todayJobs = jobs.filter((j) => {
    const diff = Date.now() - new Date(j.posted_at).getTime()
    return diff < 86400000
  })

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="New Openings"
          value={todayJobs.length}
          sub="Today"
          subColor="text-blue-600"
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          label="Tracked Companies"
          value={companies.length}
          sub="Active"
          subColor="text-green-600"
          icon={Building2}
          iconBg="bg-green-50"
          iconColor="text-green-500"
        />
        <StatCard
          label="Applications"
          value={apps.length}
          sub="In Progress"
          subColor="text-amber-600"
          icon={Target}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />
        <StatCard
          label="Interviews"
          value={stats?.interviews_secured ?? 0}
          sub="Secured"
          subColor="text-purple-600"
          icon={TrendingUp}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent openings — takes 2/3 */}
        <div className="lg:col-span-2">
          <RecentOpenings jobs={jobs} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <TrackedCompaniesPanel />
        </div>
      </div>

      {/* CTA banner */}
      <div className="rounded-xl border bg-white shadow-sm p-6 flex items-center gap-6">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Target className="size-7 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-base text-primary">Let&apos;s find your perfect role!</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Search job openings from your tracked companies, or log a new application you've sent.
          </p>
        </div>
        <Link
          href="/feed"
          className="shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Browse Jobs
        </Link>
      </div>
    </div>
  )
}
