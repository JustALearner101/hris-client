import "./globals.css"
import React from "react"
import Sidebar from "@/components/sidebar/Sidebar"

export const metadata = {
  title: "HRIS",
  description: "HRIS Dashboard and Modules",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="flex min-h-dvh">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">
            {children}
              s
          </div>
        </div>
      </body>
    </html>
  )
}
