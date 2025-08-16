"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {setSession} from "@/lib/services/apiService";
import apiService from "@/lib/services/apiService";
import {RegisterForm} from "@/components/auth/register-form";

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");

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

    const handleRegister = async (email: string, password: string) => {
        setIsLoading(true);
        setRegisterError("");
        try {
            // Utiliser les options de notification
            const res = await apiService.post(
                "/api/auth/register", 
                {email, password, name: '', permissions: 'client'},
                { 
                    showLoadingToast: true, 
                    loadingMessage: "Création du compte en cours...", 
                    successMessage: "Compte créé avec succès !"
                }
            );
            
            const {user, accessToken, refreshToken} = res.data;
            setSession({accessToken, refreshToken, userId: user?.id});
            
            // Fallback : synchronisation manuelle si le cookie n'est pas écrit
            if (!document.cookie.includes('accessToken=')) {
                document.cookie = `accessToken=${accessToken};path=/;samesite=strict`;
            }
            
            // Nettoyer les données de flow précédentes
            localStorage.removeItem("selectedSerieId");
            localStorage.removeItem("notes");
            
            setRegisterError(""); // Effacer les erreurs précédentes
            
            // Redirection après un court délai pour que l'utilisateur voie le message de succès
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        } catch (err: any) {
            if (err?.response?.status === 409) {
                setRegisterError("Un compte existe déjà avec cette adresse email.");
            } else {
                setRegisterError("Erreur lors de l'inscription. Veuillez réessayer.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <RegisterForm 
                    onRegister={handleRegister}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}