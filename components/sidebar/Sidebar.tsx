"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  CalendarCheck2,
  CalendarRange,
  ClipboardList,
  Wallet,
  BarChart3,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  Search,
  Building2,
} from "lucide-react"

export type UserRole = "employee" | "manager" | "admin"

export type SidebarBadge = {
  value: number
  ariaLabel?: string
}

export type SidebarItem = {
  label: string
  href: string
  icon: React.ReactNode
  badge?: SidebarBadge
}

function getRoleFromStorage(): UserRole {
  if (typeof window === "undefined") return "manager"
  const r = window.localStorage.getItem("user_role") as UserRole | null
  return r ?? "manager"
}

function getTenantFromStorage(): string {
  if (typeof window === "undefined") return "demo-tenant"
  return window.localStorage.getItem("tenant_id") || "demo-tenant"
}

function setTenantToStorage(tenantId: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem("tenant_id", tenantId)
}

function getMenuModel(role: UserRole): SidebarItem[] {
  const base: SidebarItem[] = [
    { label: "Dashboard", href: "/", icon: <Home className="size-4" /> },
  ]

  if (role === "employee") {
    return [
      ...base,
      { label: "My Profile", href: "/profile", icon: <Users className="size-4" /> },
      { label: "Attendance", href: "/attendance", icon: <CalendarCheck2 className="size-4" /> },
      { label: "Leave", href: "/leave", icon: <CalendarRange className="size-4" /> },
      { label: "Payroll", href: "/payroll", icon: <Wallet className="size-4" /> },
      { label: "Support", href: "/support", icon: <LifeBuoy className="size-4" /> },
    ]
  }

  if (role === "manager") {
    return [
      ...base,
      { label: "People", href: "/people", icon: <Users className="size-4" />, badge: { value: 0 } },
      { label: "Attendance", href: "/attendance", icon: <ClipboardList className="size-4" />, badge: { value: 2, ariaLabel: "attendance approvals pending" } },
      { label: "Leave", href: "/leave", icon: <CalendarRange className="size-4" />, badge: { value: 3, ariaLabel: "leave approvals pending" } },
      { label: "Payroll", href: "/payroll", icon: <Wallet className="size-4" /> },
      { label: "Reports", href: "/reports", icon: <BarChart3 className="size-4" /> },
      { label: "Support", href: "/support", icon: <LifeBuoy className="size-4" /> },
    ]
  }

  // admin
  return [
    ...base,
    { label: "People", href: "/people", icon: <Users className="size-4" /> },
    { label: "Attendance", href: "/attendance", icon: <ClipboardList className="size-4" /> },
    { label: "Leave", href: "/leave", icon: <CalendarRange className="size-4" /> },
    { label: "Payroll", href: "/payroll", icon: <Wallet className="size-4" /> },
    { label: "Reports", href: "/reports", icon: <BarChart3 className="size-4" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="size-4" /> },
    { label: "Support", href: "/support", icon: <LifeBuoy className="size-4" /> },
  ]
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = React.useState(false)
  const [filter, setFilter] = React.useState("")
  const [role, setRole] = React.useState<UserRole>(() => getRoleFromStorage())
  const [tenant, setTenant] = React.useState<string>(() => getTenantFromStorage())

  // Persist role changes for demo purposes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user_role", role)
    }
  }, [role])

  React.useEffect(() => {
    setTenantToStorage(tenant)
  }, [tenant])

  const items = React.useMemo(() => {
    const base = getMenuModel(role)
    if (!filter) return base
    const q = filter.toLowerCase()
    return base.filter(i => i.label.toLowerCase().includes(q))
  }, [role, filter])

  return (
    <aside
      className={cn(
        "flex h-dvh flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        collapsed ? "w-[64px]" : "w-64",
        className
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b">
        <Building2 className="size-5" />
        {!collapsed && (
          <div className="flex-1">
            <div className="font-semibold leading-none">HRIS</div>
            <div className="text-xs text-muted-foreground truncate">Tenant: {tenant}</div>
          </div>
        )}
        <button
          className="ml-auto inline-flex size-7 items-center justify-center rounded hover:bg-accent"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(v => !v)}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <input
              className="w-full rounded-md border bg-background pl-8 pr-2 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              placeholder="Search menu..."
              value={filter}
              onChange={(e) => setFilter(e.currentTarget.value)}
            />
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-auto px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                // Simple guard: prevent navigating to same route
                if (pathname === item.href) {
                  e.preventDefault()
                }
              }}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="inline-flex items-center justify-center size-7 rounded bg-transparent">
                {item.icon}
              </span>
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && item.badge.value > 0 && (
                <span className="ml-auto rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5" aria-label={item.badge.ariaLabel}>
                  {item.badge.value}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3 space-y-2">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">Context</div>
        )}
        {!collapsed && (
          <div className="grid grid-cols-2 gap-2">
            <select
              className="col-span-2 rounded-md border bg-background px-2 py-1.5 text-xs"
              value={tenant}
              onChange={(e) => {
                const v = e.currentTarget.value
                setTenant(v)
                // Force a soft reload to re-fetch dashboard with new tenant header
                router.refresh()
              }}
            >
              <option value="demo-tenant">demo-tenant</option>
              <option value="acme-corp">acme-corp</option>
              <option value="globex">globex</option>
            </select>
            <select
              className="col-span-2 rounded-md border bg-background px-2 py-1.5 text-xs"
              value={role}
              onChange={(e) => setRole(e.currentTarget.value as UserRole)}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
