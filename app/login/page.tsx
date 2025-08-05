"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Auth } from "@/components/auth/AuthForm";
import apiServiceAdmin, { setSessionAdmin } from "@/lib/services/apiServiceAdmin";

export default function Page() {
    const router = useRouter();
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const adminId = localStorage.getItem("adminId");
            if (adminId) {
                router.push("/dashboard");
            }
        }
    }, [router]);

    // Cette logique sera passée au composant AuthForm via un context ou props custom si besoin
    // Ici, on laisse le composant AuthForm gérer l'affichage et la validation du formulaire
    // et on gère la connexion ici via un callback custom (à brancher dans AuthSignIn)

    // Pour l'instant, on affiche juste le composant Auth (connexion, reset, etc.)
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Auth />
            </div>
        </div>
    );
}

