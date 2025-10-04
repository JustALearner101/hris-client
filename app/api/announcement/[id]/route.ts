import { NextResponse } from "next/server"
import { getAnnouncementById, updateAnnouncement, deleteAnnouncement } from "../data"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const item = getAnnouncementById(params.id)
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ data: item })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()
    const updated = updateAnnouncement(params.id, body)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ data: updated })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const deleted = deleteAnnouncement(params.id)
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true })
}