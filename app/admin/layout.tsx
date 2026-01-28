"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/hooks/useAuth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, loading, role } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    if (role !== "admin") {
      router.replace("/") // partie publique
    }
  }, [loading, isAuthenticated, role, router])

  if (loading || !isAuthenticated || role !== "admin") return null

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
