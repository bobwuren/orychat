"use client";

import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export type AuthState = "idle" | "loading" | "success" | "error";

interface AuthStateNotifierProps {
  state: AuthState;
  message?: string;
  action?: "login" | "register" | "logout";
  clearState?: () => void;
}

export function AuthStateNotifier({
  state,
  message,
  action = "login",
  clearState,
}: AuthStateNotifierProps) {
  // Action message mapping
  const actionMessages = {
    login: {
      loading: "Connexion en cours...",
      success: "Connexion réussie !",
      error: message || "Échec de la connexion",
    },
    register: {
      loading: "Création du compte en cours...",
      success: "Compte créé avec succès !",
      error: message || "Échec de la création du compte",
    },
    logout: {
      loading: "Déconnexion en cours...",
      success: "Déconnexion réussie !",
      error: message || "Échec de la déconnexion",
    },
  };

  // Auto-clear success and error states after a delay
  useEffect(() => {
    if ((state === "success" || state === "error") && clearState) {
      const timer = setTimeout(() => {
        clearState();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state, clearState]);

  // Don't render anything in idle state
  if (state === "idle") return null;

  return (
    <Alert
      className={`mb-4 animate-in slide-in-from-top duration-300 ${
        state === "loading"
          ? "border-primary/20 bg-primary/5"
          : state === "success"
          ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900"
          : "border-destructive/20 bg-destructive/5"
      }`}
    >
      <div className="flex items-center gap-2">
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        ) : state === "success" ? (
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <XCircle className="h-4 w-4 text-destructive" />
        )}
        <span
          className={`text-sm font-medium ${
            state === "loading"
              ? "text-primary"
              : state === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-destructive"
          }`}
        >
          {actionMessages[action][state]}
        </span>
      </div>
    </Alert>
  );
}
