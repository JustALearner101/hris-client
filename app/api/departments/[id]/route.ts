import { NextResponse } from "next/server"
import { getDepartment, updateDepartment, archiveDepartment, getPath } from "../data"

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const d = getDepartment(params.id)
    if (!d) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    const path = getPath(params.id)
    return NextResponse.json({ data: d, path })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json()
    const result = updateDepartment(params.id, body)
    if ("error" in result) {
        const status = result.error === "NOT_FOUND" ? 404 : 409
        return NextResponse.json({ error: result.error }, { status })
    }
    return NextResponse.json(result.data)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const result = archiveDepartment(params.id)
    if ("error" in result) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    return NextResponse.json(result.data)
}