"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {restoreSession, setSession} from "@/lib/services/apiService";
import apiService from "@/lib/services/apiService";
import {LoginForm} from "@/components/auth/login-form";

export default function Page() {
    const router = useRouter();
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Affiche le formulaire immédiatement, puis redirige si déjà authentifié
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userIdStr = localStorage.getItem("userId");
            const userId = userIdStr ? Number(userIdStr) : null;
            if (userId) {
                router.push("/dashboard");
            }
        }
    }, [router]);

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Utiliser les options de notification
            const res = await apiService.post(
                "/api/auth/login", 
                {email, password},
                { 
                    showLoadingToast: true, 
                    loadingMessage: "Connexion en cours...", 
                    successMessage: "Connexion réussie !"
                }
            );
            
            const {user, accessToken, refreshToken} = res.data;
            setSession({accessToken, refreshToken, userId: user?.id});
            
            // Fallback : synchronisation manuelle si le cookie n'est pas écrit
            if (!document.cookie.includes('accessToken=')) {
                document.cookie = `accessToken=${accessToken};path=/;samesite=strict`;
            }
            
            setLoginError(""); // Effacer les erreurs précédentes
            
            // Redirection après un court délai pour que l'utilisateur voie le message de succès
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);
        } catch (err: any) {
            if (err?.response?.status === 401 || err?.response?.status === 400) {
                setLoginError("Identifiants invalides. Veuillez réessayer.");
            } else {
                setLoginError("Erreur de connexion. Veuillez réessayer.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <LoginForm onLogin={handleLogin} isLoading={isLoading} loginError={loginError}/>
            </div>
        </div>
    );
}