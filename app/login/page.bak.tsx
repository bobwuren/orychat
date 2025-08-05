// Backup of previous login page before refactor
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { restoreSession, setSession } from "@/lib/services/apiService";
import apiService from "@/lib/services/apiService";
import { LoginForm } from "@/components/auth/login-form";
// import useRouteProtection from "@/hooks/useRouteProtection";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loginError, setLoginError] = useState("");

  // 🛡️ Protection de route : rediriger si déjà connecté (basé sur le cookie, pas juste localStorage)
  useEffect(() => {
    if (typeof document !== "undefined") {
      const hasCookie = document.cookie.includes("accessToken=");
      if (hasCookie) {
        window.location.href = "/dashboard";
      }
    }
  }, []);
  // const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    restoreSession();
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        // 🔧 IMPORTANT : Forcer le rechargement pour que le middleware détecte les cookies
        window.location.href = "/dashboard";
      } else {
        setChecked(true);
      }
    }
  }, []);

  // Affiche le formulaire immédiatement, puis redirige si déjà authentifié
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiService.post("/api/auth/login", { email, password });
      const { user, accessToken, refreshToken } = res.data;
      setSession({ accessToken, refreshToken, userId: user?.id });
      // Fallback : synchronisation manuelle si le cookie n'est pas écrit
      if (!document.cookie.includes("accessToken=")) {
        document.cookie = `accessToken=${accessToken};path=/;samesite=strict`;
      }
      window.location.href = "/dashboard";
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

  if (!checked) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          onLogin={handleLogin}
          isLoading={isLoading}
          loginError={loginError}
        />
      </div>
    </div>
  );
}
