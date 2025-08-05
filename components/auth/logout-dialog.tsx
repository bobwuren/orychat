"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { LogOut, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { logoutAdmin } from "@/lib/services/apiServiceAdmin"
import { toast } from "@/hooks/use-toast"

interface LogoutDialogProps {
  children?: React.ReactNode
  triggerClassName?: string
  onLogout?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function LogoutDialog({ 
  children, 
  triggerClassName,
  onLogout,
  open,
  onOpenChange
}: LogoutDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Appel API pour déconnecter l'admin côté serveur
      await logoutAdmin()
      
      // Fermer le dialog
      if (onOpenChange) {
        onOpenChange(false)
      }
      
      // Notifier l'utilisateur
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      })
      
      // Callback personnalisé si fourni
      if (onLogout) {
        onLogout()
      } else {
        // Redirection par défaut vers la page de connexion
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const dialogContent = (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <AlertDialogTrigger asChild>
          {children || (
            <Button 
              variant="ghost" 
              size="sm"
              className={triggerClassName}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          )}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="sm:max-w-[425px] fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder au tableau de bord d&apos;administration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Déconnexion...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  // Toujours utiliser createPortal pour forcer le rendu au niveau du body et garantir le centrage
  if (mounted && typeof window !== 'undefined') {
    return createPortal(dialogContent, document.body)
  }

  return dialogContent
}

// Composant avec trigger personnalisé
export function LogoutDialogTrigger({ 
  variant = "ghost",
  size = "sm",
  className,
  onLogout,
  children
}: {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onLogout?: () => void
  children?: React.ReactNode
}) {
  return (
    <LogoutDialog onLogout={onLogout}>
      <Button variant={variant} size={size} className={className}>
        {children || (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </>
        )}
      </Button>
    </LogoutDialog>
  )
}

// Composant menu item pour les dropdowns
export function LogoutDialogMenuItem({ 
  onLogout,
  className
}: {
  onLogout?: () => void
  className?: string
}) {
  return (
    <LogoutDialog onLogout={onLogout}>
      <div className={`flex items-center gap-2 cursor-pointer px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground ${className}`}>
        <LogOut className="h-4 w-4" />
        Se déconnecter
      </div>
    </LogoutDialog>
  )
}
