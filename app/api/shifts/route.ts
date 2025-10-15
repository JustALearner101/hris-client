import { type NextRequest, NextResponse } from "next/server"
import { listShifts, createShift } from "./data"
import type { Shift, ShiftFilters } from "@/types/shift"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const filters: ShiftFilters = {
        search: searchParams.get("search") ?? undefined,
        type: (searchParams.get("type") as any) ?? "ALL",
        active: (searchParams.get("active") as any) ?? "all",
        page: Number(searchParams.get("page") ?? "1"),
        pageSize: Number(searchParams.get("pageSize") ?? "10"),
    }
    const { data, total } = listShifts(filters)
    return NextResponse.json({
        data,
        total,
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 10,
    })
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as Omit<Shift, "id" | "createdAt" | "updatedAt" | "version">
        const created = createShift({
            tenantId: body.tenantId || "tenant-demo",
            entityId: body.entityId || "entity-demo",
            code: body.code,
            name: body.name,
            type: body.type,
            startTime: body.startTime,
            endTime: body.endTime,
            breakDurationMin: body.breakDurationMin ?? 60,
            gracePeriodMin: body.gracePeriodMin ?? 10,
            workingHours: body.workingHours ?? 8,
            validFrom: body.validFrom,
            validTo: body.validTo,
            isDefault: !!body.isDefault,
            active: body.active ?? true,
            createdBy: body.createdBy,
            updatedBy: body.updatedBy,
            version: 1, // ignored by create
            createdAt: "", // ignored by create
            updatedAt: "", // ignored by create
            id: "", // ignored by create
        } as any)
        return NextResponse.json(created, { status: 201 })
    } catch (e: any) {
        return NextResponse.json({ error: e.message ?? "Failed to create" }, { status: 400 })
    }
}