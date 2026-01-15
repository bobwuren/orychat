"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/hooks"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, isRestored, restoreSession } = useAuth()

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  useEffect(() => {
    if (isRestored && !isAuthenticated && !isLoading) {
      router.push("/login")
    }
  }, [isRestored, isAuthenticated, isLoading, router])

  if (!isRestored) return null
  if (isRestored && !isAuthenticated) return null

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
