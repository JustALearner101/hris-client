"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Users, CalendarX, Wallet, TrendingUp, Building2, RefreshCw } from "lucide-react"

// Types representing the Model contracts returned by backend services
// Note: Sensitive fields (like employee identifiers) should be encrypted and tenant-scoped on the server.
// Client only receives already authorized and filtered data.

type HeadcountPoint = { month: string; value: number }

type Absentee = { id: string; name: string; department: string }

type PayrollSummary = {
  period: string
  status: "Pending" | "Processing" | "Completed" | "Failed"
  totalGross?: number
}

type LeaveSummary = {
  onLeaveToday: number
  upcomingWeek: number
  remainingBalanceAvgDays: number
}

type PerformanceSummary = {
  averageScore: number // e.g., 0-5
  lastUpdatedISO: string
}

type DashboardData = {
  headcount: number
  monthlyHeadcount: HeadcountPoint[]
  absenteesToday: number
  absentees: Absentee[]
  payroll: PayrollSummary
  leave: LeaveSummary
  performance: PerformanceSummary
  byDepartment?: { name: string; count: number }[]
}

async function fetchDashboardData(signal?: AbortSignal): Promise<DashboardData> {
  const tenantId = typeof window !== "undefined"
    ? window.localStorage.getItem("tenant_id") || "demo-tenant"
    : "demo-tenant"
  try {
    const res = await fetch("/api/v1/dashboard/summary", {
      method: "GET",
      headers: {
        "accept": "application/json",
        "x-tenant-id": tenantId,
      },
      signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as DashboardData
  } catch (err) {
    // Fallback mock so the View can render until backend endpoints are available
    const now = new Date()
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const currentMonthIndex = now.getMonth()
    const monthlyHeadcount: HeadcountPoint[] = Array.from({ length: 6 }).map((_, i) => {
      const idx = (currentMonthIndex - (5 - i) + 12) % 12
      return { month: months[idx], value: 100 + i * 6 + (i % 2 === 0 ? 2 : -3) }
    })

    return {
      headcount: monthlyHeadcount[monthlyHeadcount.length - 1].value,
      monthlyHeadcount,
      absenteesToday: 5,
      absentees: [
        { id: "e1", name: "Alice Johnson", department: "Sales" },
        { id: "e2", name: "Marcus Lee", department: "Engineering" },
        { id: "e3", name: "Priya Patel", department: "Finance" },
      ],
      payroll: { period: "Current", status: "Processing", totalGross: 182450 },
      leave: { onLeaveToday: 12, upcomingWeek: 18, remainingBalanceAvgDays: 11.4 },
      performance: { averageScore: 3.8, lastUpdatedISO: now.toISOString() },
      byDepartment: [
        { name: "Engineering", count: 58 },
        { name: "Sales", count: 32 },
        { name: "HR", count: 9 },
        { name: "Finance", count: 14 },
        { name: "Operations", count: 17 },
      ],
    }
  }
}

export default function Home() {
  const [data, setData] = React.useState<DashboardData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  const load = React.useCallback(async () => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    setError(null)
    try {
      const d = await fetchDashboardData(ac.signal)
      setData(d)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load dashboard"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
    return () => abortRef.current?.abort()
  }, [load])

  const maxHC = React.useMemo(() => {
    if (!data?.monthlyHeadcount?.length) return 0
    return Math.max(...data.monthlyHeadcount.map(p => p.value))
  }, [data])

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Header */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">HR Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of workforce, attendance, payroll and performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={load} aria-label="Refresh dashboard">
              <RefreshCw className="size-4" /> Refresh
            </Button>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Headcount"
            value={data?.headcount ?? "—"}
            icon={<Users className="size-5" />}
            loading={loading}
          />
          <KpiCard
            title="Absentees Today"
            value={data?.absenteesToday ?? "—"}
            icon={<CalendarX className="size-5" />}
            loading={loading}
          />
          <KpiCard
            title="Payroll Status"
            value={data?.payroll ? data.payroll.status : "—"}
            subValue={data?.payroll?.totalGross ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(data.payroll.totalGross) : undefined}
            icon={<Wallet className="size-5" />}
            loading={loading}
          />
          <KpiCard
            title="Avg Performance"
            value={data?.performance ? data.performance.averageScore.toFixed(1) : "—"}
            icon={<TrendingUp className="size-5" />}
            loading={loading}
          />
        </section>

        {/* Headcount trend + Absentees list */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium flex items-center gap-2"><TrendingUp className="size-4" /> Headcount (last 6 months)</h2>
              <span className="text-xs text-muted-foreground">Max: {maxHC || "—"}</span>
            </div>
            {loading ? (
              <div className="h-40 animate-pulse rounded-md bg-muted" />
            ) : data?.monthlyHeadcount?.length ? (
              <div className="h-48 flex items-end gap-2">
                {data.monthlyHeadcount.map((p) => (
                  <div key={p.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t bg-primary/80 dark:bg-primary/70"
                      style={{ height: maxHC ? `${Math.max(6, (p.value / maxHC) * 100)}%` : "0%" }}
                      title={`${p.month}: ${p.value}`}
                    />
                    <span className="text-xs text-muted-foreground">{p.month}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={error ? `Error: ${error}` : "No data"} />
            )}
          </div>

          <div className="rounded-xl border p-4 space-y-3">
            <h2 className="font-medium flex items-center gap-2"><Building2 className="size-4" /> Today’s Absentees</h2>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : data?.absentees?.length ? (
              <ul className="divide-y">
                {data.absentees.map((a) => (
                  <li key={a.id} className="py-2 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{a.name}</span>
                      <span className="text-xs text-muted-foreground">{a.department}</span>
                    </div>
                    <span className="text-xs rounded-full bg-muted px-2 py-1">Absent</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message={error ? `Error: ${error}` : "No absentees"} />
            )}
          </div>
        </section>

        {/* Leave + Payroll detail */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-2">Leave Summary</h2>
            {loading ? (
              <div className="h-24 animate-pulse rounded bg-muted" />
            ) : data?.leave ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold">{data.leave.onLeaveToday}</div>
                  <div className="text-xs text-muted-foreground">On leave today</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">{data.leave.upcomingWeek}</div>
                  <div className="text-xs text-muted-foreground">Upcoming week</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">{data.leave.remainingBalanceAvgDays.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Avg remaining days</div>
                </div>
              </div>
            ) : (
              <EmptyState message={error ? `Error: ${error}` : "No leave data"} />
            )}
          </div>

          <div className="rounded-xl border p-4">
            <h2 className="font-medium mb-2">Payroll</h2>
            {loading ? (
              <div className="h-24 animate-pulse rounded bg-muted" />
            ) : data?.payroll ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Period</span>
                  <span className="font-medium">{data.payroll.period}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Status</span>
                  <span className="font-medium">{data.payroll.status}</span>
                </div>
                {typeof data.payroll.totalGross === "number" && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Total gross</span>
                    <span className="font-medium">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(data.payroll.totalGross)}</span>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState message={error ? `Error: ${error}` : "No payroll data"} />
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function KpiCard({ title, value, subValue, icon, loading }: { title: string; value: React.ReactNode; subValue?: string; icon?: React.ReactNode; loading?: boolean }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon}
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded bg-muted" />
      ) : (
        <>
          <div className="mt-2 text-2xl font-semibold">{value}</div>
          {subValue && <div className="text-xs text-muted-foreground">{subValue}</div>}
        </>
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-32 items-center justify-center rounded-md border text-sm text-muted-foreground">
      {message}
    </div>
  )
}
