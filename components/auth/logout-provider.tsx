"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { LogoutDialog } from "./logout-dialog"

interface LogoutContextType {
  openLogoutDialog: () => void
  closeLogoutDialog: () => void
}

const LogoutContext = createContext<LogoutContextType | undefined>(undefined)

export function LogoutProvider({ children }: { children: ReactNode }) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  
  const openLogoutDialog = () => setShowLogoutDialog(true)
  const closeLogoutDialog = () => setShowLogoutDialog(false)
  
  return (
    <LogoutContext.Provider value={{ openLogoutDialog, closeLogoutDialog }}>
      {children}
      <LogoutDialog 
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </LogoutContext.Provider>
  )
}

export function useLogout() {
  const context = useContext(LogoutContext)
  if (context === undefined) {
    throw new Error("useLogout must be used within a LogoutProvider")
  }
  return context
}
