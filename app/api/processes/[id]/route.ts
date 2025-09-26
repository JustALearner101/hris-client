import { NextResponse } from "next/server"
import { deleteProcess, getProcess, updateProcess } from "../data"

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const found = getProcess(params.id)
    if (!found) return NextResponse.json({ message: "Not found" }, { status: 404 })
    return NextResponse.json(found)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const patch = await req.json()
    const updated = updateProcess(params.id, patch)
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    deleteProcess(params.id)
    return NextResponse.json({ ok: true })
}