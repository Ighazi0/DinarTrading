import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/footer"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}
