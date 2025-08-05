"use client";
import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {LogOut, Loader2} from "lucide-react";
import apiService, {clearSession} from "@/lib/services/apiService";
import { AuthStateNotifier, AuthState } from "./AuthStateNotifier";
export default function LogoutButton({className = "", children}: { className?: string; children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [authState, setAuthState] = useState<AuthState>("idle");
    const [stateMessage, setStateMessage] = useState("");
    const router = useRouter();

    // Réinitialiser l'état d'authentification
    const clearAuthState = () => {
        setAuthState("idle");
    };
    
    const handleLogout = async () => {
        setLoading(true);
        setAuthState("loading");
        try {
            const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
            // Utiliser les options de notification
            await apiService.post(
                "/api/auth/logout", 
                {refreshToken},
                { 
                    showLoadingToast: true, 
                    loadingMessage: "Déconnexion en cours...", 
                    successMessage: "Vous êtes maintenant déconnecté"
                }
            );
            
            setAuthState("success");
            
            // Attendre un peu pour que l'utilisateur voie le message de succès
            setTimeout(() => {
                clearSession();
                setLoading(false);
                setOpen(false);
                router.push("/login");
            }, 1000);
        } catch (e) {
            // On veut quand même déconnecter l'utilisateur même en cas d'erreur
            setAuthState("success"); // Affichons succès quand même pour l'UX
            
            setTimeout(() => {
                clearSession();
                setLoading(false);
                setOpen(false);
                router.push("/login");
            }, 1000);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className={className}>
                    <LogOut className="w-4 h-4 mr-2"/>
                    {children || "Déconnexion"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-0 shadow-2xl bg-card/90 backdrop-blur-md rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-2xl pointer-events-none" />
                <AlertDialogHeader className="relative">
                    <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-primary">Se déconnecter</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground font-medium">
                        Êtes-vous sûr de vouloir vous déconnecter ?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                {/* État de déconnexion */}
                <div className="my-2 relative">
                    <AuthStateNotifier 
                        state={authState} 
                        action="logout"
                        clearState={clearAuthState}
                    />
                </div>
                
                <AlertDialogFooter className="relative">
                    <AlertDialogCancel 
                        disabled={loading} 
                        className="shadow-lg hover:shadow-xl transition-all border-2 rounded-xl hover:border-border/80"
                    >
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleLogout} 
                        disabled={loading} 
                        className="bg-destructive text-destructive-foreground shadow-lg hover:shadow-destructive/20 hover:bg-destructive/90 transition-all rounded-xl"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Déconnexion...
                            </>
                        ) : "Oui, se déconnecter"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}