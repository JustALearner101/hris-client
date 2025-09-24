import { KpiCard } from "@/components/kpi-card/kpi-card"
import { RevenueAreaChart } from "@/components/revenue-area-chart/revenue-area-chart"
import { RecentActivity } from "@/components/recent-activity/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmployeeDashboard(){
    return(
        <div className="space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-pretty">Welcome back, </h1>
                <p className="text-muted-foreground">Streamlined overview of your workforce, attendance, and payroll status.</p>
            </header>
        </div>
    )
}