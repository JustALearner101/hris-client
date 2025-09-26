import { NextResponse } from "next/server"
import { getById, remove, update } from "../data"

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const item = getById(params.id)
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ data: item })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()
    const item = update(params.id, body)
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ data: item })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const ok = remove(params.id)
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true })
}