import { type NextRequest, NextResponse } from "next/server"
import { getShift, updateShift, softDeleteShift, hardDeleteShift } from "../data"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const item = getShift(params.id)
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        const updated = updateShift(params.id, body)
        return NextResponse.json(updated)
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to update"
        return NextResponse.json({ error: message }, { status: 400 })    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const mode = new URL(req.url).searchParams.get("mode") // "soft" | "hard"
    if (mode === "hard") {
        const ok = hardDeleteShift(params.id)
        return NextResponse.json({ ok })
    }
    const updated = softDeleteShift(params.id)
    return NextResponse.json(updated)
}