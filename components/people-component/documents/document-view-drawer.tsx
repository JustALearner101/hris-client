"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import type { DocumentItem } from "@/types/document"
import { format } from "date-fns"

type Props = {
    open: boolean
    onOpenChange: (v: boolean) => void
    doc?: DocumentItem | null
}

export function DocumentViewDrawer({ open, onOpenChange, doc }: Props) {
    if (!doc) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[420px] sm:w-[520px]">
                <SheetHeader>
                    <SheetTitle className="text-pretty">{doc.name}</SheetTitle>
                    <SheetDescription>Document details and metadata</SheetDescription>
                </SheetHeader>

                <div className="mt-4 grid gap-4">
                    <div className="rounded-md border bg-muted/30 p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Preview (static)</span>
                        </div>
                        <div className="aspect-video rounded-md bg-background shadow-inner" />
                    </div>

                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Category</span>
                            <span className="text-sm font-medium">{doc.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Assigned To</span>
                            <span className="text-sm font-medium">{doc.employee?.name ?? "Company-wide"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Version</span>
                            <span className="text-sm font-medium">v{doc.version}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Uploaded</span>
                            <span className="text-sm font-medium">{format(new Date(doc.uploadedAt), "PP")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Expiry</span>
                            <span className="text-sm font-medium">
                {doc.expiryDate ? format(new Date(doc.expiryDate), "PP") : "-"}
              </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge
                                variant={doc.status === "expired" ? "destructive" : doc.status === "expiring" ? "secondary" : "default"}
                            >
                                {doc.status === "expiring" ? "Expiring soon" : doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                        <Button variant="ghost">Replace Version</Button>
                        <Button variant="ghost" className="ml-auto">
                            Audit Trail
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}